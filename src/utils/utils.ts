import * as ugly from "uglify-js";
import * as fs from "fs";
import * as path from "path";
import {Plugin, PluginHandler, PluginResultInformation} from "../plugin/plugin";
import {Serializable} from "../core/config";

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

PluginHandler.register(new Minifier());
PluginHandler.register(new Shebang());