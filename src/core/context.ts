import * as p from "path";
import {Diagnostic, Node, Project, SourceFile, SyntaxKind} from "ts-morph";
import {ImportReference, ModuleItem} from "./types";
import {set_status, write_error, write_log} from "./output";
import {Config} from "./config";
import {CWD} from "./global";

let modules: { [module: string]: string[] }

export function init_translation(config: Config): void {
    modules = config.modules;
}

export function translate_to_id(module: string, path: string, dependencies: string[]): string {
    if (p.extname(path) != "") {
        path = path.replace(/\.[^/.]+$/, "")
    }

    const pathWithoutExt: string = path = path.replace(/\\/gi, "/");
    path = path.replace(CWD.replace(/\\/gi, "/") + "/", "") + ".ts";

    if (modules[module].includes(path)) {
        return "\"" + module + "_" + p.basename(pathWithoutExt) + "_" + modules[module].indexOf(path) + "\"";
    }

    for (let dependency of dependencies) {
        if (modules[dependency].includes(path)) {
            return "\"" + dependency + "_" + p.basename(pathWithoutExt) + "_" + modules[dependency].indexOf(path) + "\"";
        }
    }

    write_error(`ERROR: Could not map path '${path}'`);
    set_status("FAIL");
    return "\"" + module + "_undefined\"";
}

export function get_all_translations(module: string): { [file: string]: string } {
    let x: { [file: string]: string } = {};
    modules[module].forEach(value => x[value] = module + "_" + p.basename(value) + "_" + modules[module].indexOf(value))
    return x;
}

export function find_by_name(sourceFile: SourceFile, name: string) {
    return sourceFile.getDescendantsOfKind(SyntaxKind.Identifier)
        .filter(identifier => identifier.getText() === name)
        .map(identifier => identifier.getParent())[0];
}

export function replace_type_name(module: ModuleItem, name: string, newName: string) {
    module.module.getDescendantsOfKind(SyntaxKind.Identifier).forEach(identifier => {
        if (identifier.getText() == name) {
            const parent: Node = identifier.getParent();
            if (parent && parent.getKind() == SyntaxKind.TypeReference) {
                identifier.replaceWithText(newName);
            }
        }
    });
}

export function check_diagnostics(project: Project): boolean {
    const diagnostics: Diagnostic[] = project.getPreEmitDiagnostics();
    if (diagnostics.length == 0) {
        return true;
    }

    write_log(project.formatDiagnosticsWithColorAndContext(diagnostics));

    return false;
}

export function compare_import(imp1: ImportReference, imp2: ImportReference): boolean {
    if (imp1.kind != imp2.kind) {
        return false;
    }

    if (imp1.items.length != imp2.items.length) {
        return false;
    }

    let doRet: boolean = false;

    imp1.items.forEach((item1, index) => {
        const item2 = imp2.items[index];

        if (item1.name != item2.name) {
            doRet = true;
        }

        if (item1.type != item2.type) {
            doRet = true;
        }
    });

    if (doRet) {
        return false;
    }

    if (imp1.path != imp2.path) {
        return false;
    }

    return true;
}