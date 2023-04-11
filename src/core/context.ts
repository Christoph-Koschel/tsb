import * as p from "path";
import {Diagnostic, Node, Project, SourceFile, SyntaxKind} from "ts-morph";
import {ImportReference, ModuleItem} from "./types";
import {write_log} from "./output";

const pairs: Map<string, string> = new Map<string, string>();

export function trans_to_id(path: string): string {
    if (p.extname(path) != "") {
        path = path.replace(/\.[^/.]+$/, "")
    }

    path = path.replace(/\\/gi, "/");

    if (pairs.has(path)) {
        return <string>pairs.get(path);
    }

    pairs.set(path, "\"" + p.basename(path) + "_" + pairs.size + "\"");
    return trans_to_id(path);
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