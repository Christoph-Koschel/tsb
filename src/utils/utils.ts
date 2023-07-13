import * as ugly from "uglify-js";
import * as fs from "fs";
import * as path from "path";
import {Plugin, PluginHandler, PluginResultInformation} from "../plugin/plugin";
import {Serializable} from "../core/config";
import {CodeBlockWriter} from "ts-morph";
import {set_status, write_error, write_warning} from "../core/output";

class Minifier extends Plugin {
    get name(): string {
        return "tsb.minifier";
    }

    init(args: Serializable[]): void {

    }

    result(fileContent: string, information: PluginResultInformation): string | null {
        const outName: string = information.outName.replace(path.extname(information.outName), ".min.js");
        const minified: ugly.MinifyOutput = ugly.minify(fileContent, {
            sourceMap: false
        });

        fs.writeFileSync(path.join(information.outDir, outName), minified.code);
        return null;
    }
}

class Shebang extends Plugin {
    init(args: Serializable[]): void {
    }

    get name(): string {
        return "tsb.shebang";
    }

    result(fileContent: string, information: PluginResultInformation): string | null {
        return "#!/usr/bin/env node\n\n" + fileContent;
    }
}

class NodeJSLoader extends Plugin {
    private module: string = "";
    private includes: string[] = [];

    init(args: Serializable[]): void {
        if (args.length < 1) {
            write_warning("WARNING: Need at first parameter a module name");
            set_status("WARNING");
            return;
        } else {
            this.module = args[0].toString();
        }

        if (args.length < 2) {
            write_warning("WARNING: Need at least one include name");
            set_status("WARNING");
            return;
        } else {
            for (let i: number = 1; i < args.length; i++) {
                this.includes.push(args[i].toString());
            }
        }
    }

    get name(): string {
        return "tsb.node.loader";
    }

    beforeLoad(writer: CodeBlockWriter, information: PluginResultInformation) {
        writer.writeLine("if (typeof require != \"function\") {");
        writer.writeLine("throw \"ERROR: 'tsb.node.loader' can only be used in a NodeJS Runtime\";");
        writer.writeLine("}");
        writer.writeLine(`for (const include of [${this.includes.map(value => "\"" + value + "\"").join(", ")}]) {`);
        writer.writeLine("require(include);");
        writer.writeLine("}");
    }
}

PluginHandler.register(new Minifier());
PluginHandler.register(new Shebang());
PluginHandler.register(new NodeJSLoader());