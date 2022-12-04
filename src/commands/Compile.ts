import {ArgumentHandler, Command, CommandConstructor} from "@yapm/fast-cli/1.0.0/handler";
import {checkProjectConfigExists} from "@yapm/yapm/1.0.0/structure";
import {cwd} from "../utils";
import * as output from "@yapm/fast-cli/1.0.0/output";
import {YAPMConfig} from "@yapm/yapm/1.0.0/types";
import {readConfig} from "@yapm/yapm/1.0.0/project";
import {getWrapper, SymbolTable} from "../helper";
import {execSync} from "child_process";
import {moveOneIn, overwriteFiles} from "../compiler";
import {minify, MinifyOptions, MinifyOutput} from "uglify-js";
import {createPackage} from "@yapm/yapm/1.0.0/bundler";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export class Compile extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        if (!checkProjectConfigExists(cwd)) {
            output.writeln_error("No project initialized");
            return 1;
        }

        output.writeln_log("==== INIT PROJECT ====");

        let config: YAPMConfig = readConfig(cwd);
        if (fs.existsSync(path.join(cwd, "build")) && fs.statSync(path.join(cwd, "build")).isDirectory()) {
            output.writeln_log("Clean up old build");
            fs.rmSync(path.join(cwd, "build"), {recursive: true});
        }
        let {writeStream, symbols, library, dynamic, resolveFiles} = this.compileFiles(config, argv);

        if (argv.hasFlag("--minify")) {
            output.writeln_log("Minify code");
            let res: MinifyOutput = minify(writeStream);
            if (!!res.error) {
                console.log(res.error.message);
            } else {
                writeStream = res.code;
            }
        } else {
            writeStream.replace(/(\r\n|\r|\n)+/gm, "\n");
        }

        output.writeln_log("Save output");
        fs.writeFileSync(path.join(cwd, "build", config.name + ".c.js"), writeStream);

        this.generateLibrary(library, resolveFiles, symbols, config, dynamic);

        return 0;
    }

    private generateLibrary(library: boolean, resolveFiles: (p: string, extension?: string, excludeCompilerFiles?: boolean) => string[], symbols: SymbolTable, config: YAPMConfig, dynamic: boolean) {
        if (library) {
            let tmp = fs.mkdtempSync(path.join(os.tmpdir(), "tsb"));

            fs.copyFileSync(path.join(cwd, "yapm.json"), path.join(tmp, "yapm.json"));

            let c: any = {};

            const files = resolveFiles(path.join(cwd, "build", "src"));

            files.forEach(file => {
                const key = file.replace(/\\/gi, "/").replace(path.join(cwd, "build", "src").replace(/\\/gi, "/"), "");
                c[key] = symbols.load(file, library, config);
            });
            fs.writeFileSync(path.join(tmp, "tsb.json"), JSON.stringify(c, null, 4));

            function copyTree(p: string, dest: string, ext: string) {
                fs.readdirSync(p).forEach(value => {
                    if (fs.statSync(path.join(p, value)).isDirectory()) {
                        copyTree(path.join(p, value), path.join(dest, value), ext);
                    } else if (fs.statSync(path.join(p, value)).isFile() && value.endsWith(ext)) {
                        if (!fs.existsSync(dest) || !fs.statSync(dest).isDirectory()) {
                            fs.mkdirSync(dest, {recursive: true});
                        }

                        fs.copyFileSync(path.join(p, value), path.join(dest, value));
                    }
                });
            }

            copyTree(path.join(cwd, "build", "header"), path.join(tmp), ".d.ts");
            if (!dynamic) {
                fs.copyFileSync(path.join(cwd, "build", config.name + ".c.js"), path.join(tmp, config.name + ".c.js"));
            }

            output.writeln_log("", true);
            let file = createPackage(tmp, (msg) => {
                output.writeln_log(msg);
            });

            output.writeln_log("Copy tarball to the output");
            fs.copyFileSync(file, path.join(cwd, path.basename(file)));
        }
    }

    private compileFiles(config: YAPMConfig, argv: ArgumentHandler) {
        let writeStream: string = "";
        const symbols: SymbolTable = new SymbolTable(config);
        const library: boolean = argv.hasFlag("--lib");
        const writeComments: boolean = !argv.hasFlag("--no-comments") && !library;
        const dynamic: boolean = argv.hasFlag("--dynamic");
        this.initLibraries(symbols);

        output.writeln_log("", true);
        output.writeln_log("==== COMPILE PROJECT ====")
        output.writeln_log("Compile typescript");

        execSync("tsc", {
            cwd: cwd,
            stdio: "inherit",
            windowsHide: true,
            encoding: "utf8"
        });

        function resolveFiles(p: string, extension: string = ".js", excludeCompilerFiles: boolean = true): string[] {
            let files: string[] = [];
            fs.readdirSync(p).forEach((entry) => {
                let x = path.join(p, entry);
                if (fs.statSync(x).isDirectory()) {
                    files.push(...resolveFiles(x));
                } else if (x.endsWith(extension) && (!x.endsWith(".c.js") || !excludeCompilerFiles)) {
                    files.push(x);
                }
            });

            return files;
        }

        let files: string[] = resolveFiles(path.join(cwd, "build", "src"));
        if (!library) {
            writeStream += (getWrapper());

            fs.readdirSync(path.join(cwd, "lib")).forEach((lib) => {
                for (const version of fs.readdirSync(path.join(cwd, "lib", lib))) {
                    let p = path.join(cwd, "lib", lib, version);
                    const files = resolveFiles(p, ".c.js", false);
                    output.writeln_log(`Checkup ${lib}@${version}`);
                    files.forEach(file => {
                        output.writeln_log(`Write ${file}`, true);
                        writeStream += fs.readFileSync(file, "utf8");
                    });
                }
            });
        }

        let [shBang, fileContents] = overwriteFiles(files);
        if (shBang) {
            writeStream = "#!/usr/bin/env node\n" + writeStream;
        }

        output.writeln_log("Put things together");
        fileContents.forEach(([file, content, imports, exports], index, array) => {
            output.writeln_log(`Add [${index + 1}|${array.length}] "${file}"`, true);
            if (writeComments) {
                writeStream += ("// " + file + os.EOL);
            }

            let ref = "";
            imports.filter(value => value.importType != "npm").forEach((value, index) => {
                if (index != 0) {
                    ref += ", ";
                }
                ref += `"${symbols.load(value.src, library, config)}"`;
            });

            writeStream += (`bundler.define("${symbols.load(file, library, config)}", [${ref}], async (__export, __import) => {` + os.EOL);
            imports.forEach(value => {
                switch (value.importType) {
                    case "lib":
                    case "file":
                        value.types.forEach((x) => {
                            if (value.importResult == "obj") {
                                writeStream += (moveOneIn(`const ${x} = __import["${symbols.load(value.src, library, config)}"].${x};`));
                            } else if (value.importResult == "bundle") {
                                writeStream += (moveOneIn(`const ${x} = __import["${symbols.load(value.src, library, config)}"];`));
                            } else if (value.importResult == "default") {
                                writeStream += (moveOneIn(`const ${value.types[0]} = __import["${symbols.load(value.src, library, config)}"].default;`));
                            }
                        });
                        break;
                    case "npm":
                        if (value.importResult == "obj") {
                            writeStream += (moveOneIn(`const {${value.types.join(",")}} = require("${value.src}");`))
                        } else if (value.importResult == "bundle") {
                            writeStream += (moveOneIn(`const ${value.types[0]} = require("${value.src}");`));
                        } else if (value.importResult == "default") {
                            writeStream += (moveOneIn(`const ${value.types[0]} = require("${value.src}").default;`));
                        } else if (value.importResult == "load") {
                            writeStream += (moveOneIn(`require("${value.src}");`));
                        }

                        break;
                }
            });
            writeStream += (moveOneIn(content));
            writeStream += (moveOneIn(`__export["${symbols.load(file, library, config)}"] = {};`));
            exports.forEach(value => {
                if (value.exportType == "normal") {
                    writeStream += (moveOneIn(`__export["${symbols.load(value.file, library, config)}"].${value.name} = ${value.name};`));
                } else if (value.exportType == "default") {
                    writeStream += (moveOneIn(`__export["${symbols.load(value.file, library, config)}"].default = ${value.name};`));
                }
            });
            writeStream += ("});" + os.EOL);
        });

        if (argv.hasAttr("-m")) {
            output.writeln_log("Write load point");
            let main = <string>argv.getAttr("-m");
            main = path.join(cwd, "build", "src", main + ".js");
            if (fs.existsSync(main) && fs.statSync(main).isFile()) {
                if (writeComments) {
                    writeStream += ("// Entry point call" + os.EOL);
                }
                writeStream += (`bundler.load("${symbols.load(main, library, config)}");\n`);
            }
        }

        if (!library) {
            writeStream += ("bundler.start();");
        }
        return {writeStream, symbols, library, dynamic, resolveFiles};
    }

    private initLibraries(symbols: SymbolTable) {
        output.writeln_log("Search for libraries");
        if (fs.existsSync(path.join(cwd, "lib")) && fs.statSync(path.join(cwd, "lib")).isDirectory()) {
            fs.readdirSync(path.join(cwd, "lib")).forEach((lib) => {
                for (const version of fs.readdirSync(path.join(cwd, "lib", lib))) {
                    let p = path.join(cwd, "lib", lib, version);
                    if (fs.existsSync(path.join(p, "tsb.json")) && fs.statSync(path.join(p, "tsb.json")).isFile()) {
                        try {
                            output.writeln_log(`Found ${lib}@${version}`, true);
                            let x = JSON.parse(fs.readFileSync(path.join(p, "tsb.json"), "utf8"));
                            Object.keys(x).forEach((key) => {
                                let parsed = path.parse(key);

                                symbols.set(`@yapm/${lib}/${version}${parsed.dir + (parsed.dir == "/" ? "" : "/") + parsed.name}`, x[key]);
                            });
                        } catch (err) {
                            break;
                        }
                    }
                }
            });
        }
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("compile")
            .addAttribute("-m", "main", true, "The file who should declared as the entry point")
            .addFlag("--lib", true, "Compiles and packs all source files as a yapm library")
            .addFlag("--dynamic", true, "Packs just the header files as a yapm library (needs the --lib flag)")
            .addFlag("--no-comments", true, "Don't write comments to the output file")
            .addFlag("--minify", true, "Minifies the output files");
    }

    getDescription(): string {
        return "Compiles the project";
    }

}