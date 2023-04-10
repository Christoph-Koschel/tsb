import * as ugly from "uglify-js";
import * as fs from "fs";
import * as path from "path";
import {Plugin, PluginHandler, PluginResultInformation} from "../plugin/plugin";
import {Serializable} from "../core/config";
import {ModuleItem} from "../core/types";
import {ClassDeclarationStructure, ModuleDeclarationStructure, Project} from "ts-morph";
import {build_JSX, tsx_translate} from "./tsx";

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

class TSX extends Plugin {
    get name(): string {
        return "tsb.tsx";
    }

    init(args: Serializable[]): void {
    }

    modify(module: ModuleItem): void {
        if (module.module.getExtension() != ".tsx") {
            return;
        }

        tsx_translate(module);
    }

    generate(): ClassDeclarationStructure[] {
        return build_JSX();
    }

    sync(information: PluginResultInformation): void {
        fs.copyFileSync(path.join(__dirname, "assets", "react.d.ts"), path.join(information.engineDir, "react.d.ts"));
        fs.copyFileSync(path.join(__dirname, "assets", "tsx.d.ts"), path.join(information.engineDir, "tsx.d.ts"));
    }
}

PluginHandler.register(new Minifier());
PluginHandler.register(new Shebang());
PluginHandler.register(new TSX());