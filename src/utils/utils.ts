import * as ugly from "uglify-js";
import * as fs from "fs";
import * as path from "path";
import {Plugin, PluginHandler, PluginResultInformation} from "../core/plugin";
import {Serializable} from "../core/config";
import {CodeBlockWriter} from "ts-morph";
import {set_status, write_warning} from "../core/output";
import {LibAssetIncludeItem, LibIncludeItem, LibIncludeType} from "../core/types";
import {CWD} from "../core/global";

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

    pack(information: PluginResultInformation): LibIncludeItem[] | false {
        return [
            {
                type: LibIncludeType.SCRIPT,
                src: path.join("out", information.module + ".min.js"),
                vdest: ""
            }
        ];
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

    beforeLoad(writer: CodeBlockWriter, information: PluginResultInformation): void {
        if (information.module == this.module) {
            writer.writeLine("if (typeof require != \"function\") {");
            writer.writeLine("throw \"ERROR: 'tsb.node.loader' can only be used in a NodeJS Runtime\";");
            writer.writeLine("}");
            writer.writeLine(`for (const include of [${this.includes.map(value => "\"" + value + "\"").join(", ")}]) {`);
            writer.writeLine("require(include);");
            writer.writeLine("}");
        }

    }
}

class Packer extends Plugin {
    private module: string = "";
    private assets: string[] = [];

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
                let p: string = args[i].toString();
                let rooted: string = path.join(CWD, p);
                if (!fs.existsSync(rooted)) {
                    write_warning(`WARNING: Path '${p}' don't not exists`);
                    set_status("WARNING");
                }

                if (fs.statSync(rooted).isFile()) {
                    this.assets.push(p);
                } else if (fs.statSync(rooted).isDirectory()) {
                    this.loopDir(p, rooted);
                }
            }
        }
    }

    private loopDir(dir: string, rooted: string): void {
        fs.readdirSync(rooted).forEach((entry: string) => {
            if (fs.statSync(path.join(rooted, entry)).isFile()) {
                this.assets.push(path.join(dir, entry));
            } else if (fs.statSync(path.join(rooted, entry)).isDirectory()) {
                this.loopDir(path.join(dir, entry), path.join(rooted, entry));
            }
        });
    }

    get name(): string {
        return "tsb.packer";
    }

    pack(information: PluginResultInformation): LibIncludeItem[] | false {
        if (information.module != this.module) {
            return false;
        }

        const includes: LibAssetIncludeItem[] = [];

        this.assets.forEach((asset) => {
            includes.push({
                type: LibIncludeType.ASSET,
                vdest: path.dirname(asset),
                src: asset,
                dest: path.dirname(asset)
            });
        });

        return includes;
    }
}

PluginHandler.register(new Minifier());
PluginHandler.register(new Shebang());
PluginHandler.register(new NodeJSLoader());
PluginHandler.register(new Packer());