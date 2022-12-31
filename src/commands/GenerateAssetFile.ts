import {ArgumentHandler, Command, CommandConstructor} from "@yapm/fast-cli/l/handler";
import {checkProjectConfigExists} from "@yapm/yapm/l/structure";
import * as output from "@yapm/fast-cli/l/output";
import {cwd} from "../utils";
import * as path from "path";
import * as fs from "fs";
import {getResourcesWrapper} from "../helper";
import {select} from "@yapm/code-database/l/linq";

export class GenerateAssetFile extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        if (!checkProjectConfigExists(cwd)) {
            output.writeln_error("No project initialized");
            return 1;
        }

        let p = path.join(cwd, <string>argv.getAttr("-d"));

        function lookupTree(p: string): string[] {
            let entries: string[] = [];
            fs.readdirSync(p).forEach(value => {
                if (fs.statSync(path.join(p, value)).isDirectory()) {
                    entries.push(...lookupTree(path.join(p, value)));
                } else if (fs.statSync(path.join(p, value)).isFile() && !value.endsWith(".yapm.zip")) {
                    output.writeln_log(`Found "${path.join(p, value)}"`, true);
                    entries.push(path.join(p, value));
                }
            });

            return entries;
        }


        if (!fs.existsSync(p) || !fs.statSync(p).isDirectory()) {
            output.writeln_error(`Path "${p}" do not exist`);
            return 1;
        }
        output.writeln_log("Lookup for files");
        let files = lookupTree(p);

        let content = getResourcesWrapper();
        let rHeader: any = {};
        let r: any = {};
        let conversion: any = {};

        output.writeln_log("Registers files");
        files.forEach((file, index, array) => {
            output.writeln_log(`Register [${index + 1}|${array.length}] ${index} => "${file}"`, true);
            let base: string = file.replace(path.join(p), "");
            let parts: string[] = base.split("\\");

            function updateObj(parts: string[], r: any, rHeader: any, conversion: any) {
                let key = <string>parts.shift();
                key = key.replace(/\./gi, "_");

                if (parts.length == 0) {
                    r[key] = {id: index};
                    rHeader[key] = "ResourcesID";
                    conversion[key] = file;
                }

                if (r[key] == undefined) {
                    r[key] = {};
                    rHeader[key] = {};
                    conversion[key] = {};
                }

                if (parts.length > 0) {
                    updateObj(parts, r[key], rHeader[key], conversion[key]);
                }
            }

            parts = select(parts).all().where((x, i) => x != "").get();
            updateObj(parts.slice(), r, rHeader, conversion);
        });

        function writeObj(obj: any, nested: number): string {
            let str = "{\n";
            let bounds = " ".repeat(nested);

            Object.keys(obj).forEach((value, index, array) => {
                let bounds: string = " ".repeat(nested + 4);
                str += bounds + value;
                str += ": ";
                if (typeof obj[value] == "object") {
                    str += writeObj(obj[value], nested + 4);
                } else {
                    str += obj[value];
                }
                str += array.length - 1 == index ? "\n" : ",\n";
            });

            str += bounds + "}";
            return str;
        }

        content += `\n${"export"} const R: ${writeObj(rHeader, 0)} = ${writeObj(r, 0)};\n\n`;

        output.writeln_log("Bundle resource files");

        function writeData(obj: any, key: string) {
            output.writeln_log("Write group: " + key);
            Object.keys(obj).forEach((value, index, array) => {
                if (typeof obj[value] == "object") {
                    writeData(obj[value], key + "." + value);
                } else {
                    output.writeln_log(`Bundle [${index + 1}|${array.length}] ${key + "." + value} => "${obj[value]}"`, true);
                    content += `data.set(${key + "." + value + ".id"}, "${fs.readFileSync(obj[value], "base64")}");\n`;
                }
            });
        }

        writeData(conversion, "R");

        const outputPath = path.join(cwd, "src", "resources.ts");
        if (fs.existsSync(outputPath) && fs.statSync(outputPath).isFile() && !argv.hasFlag("--force")) {
            output.write_error("resources.ts already exists. Delete the file manually or use the force flag");
            return 1;
        } else {
            output.writeln_log("Write \"resources.ts\"");
            fs.writeFileSync(outputPath, content);
        }

        return 0;
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("generate")
            .addAttribute("-d", "Directory", false, "The directory for the resources generation")
            .addFlag("--force", true, "Forces the generation");
    }

    getDescription(): string {
        return "Bundles non TypesScript / JavaScript files and produces a resources.ts file in the root of the src folder";
    }
}