import {
    ClassDeclaration,
    CompilerOptions,
    EnumDeclaration,
    ExportedDeclarations,
    Expression,
    FunctionDeclaration,
    Identifier,
    ImportSpecifier,
    InterfaceDeclaration,
    ModuleKind,
    ModuleResolutionKind,
    Project,
    ScriptTarget,
    SourceFile,
    SyntaxKind,
    ts,
    TypeAliasDeclaration,
    VariableDeclaration,
    VariableDeclarationList,
    VariableStatement
} from "ts-morph";
import * as path from "path";
import {check_diagnostics, replace_type_name, trans_to_id} from "./context";
import * as fs from "fs";
import {CWD} from "./global";
import {build_bundler, build_bundler_types} from "./engine";
import {build_output} from "./structure";
import {ExportReference, ImportKind, ImportReference, ImportReferenceItem, ModuleItem, SymbolType} from "./types";
import {set_full_value, set_status, set_step_value, write_status_message} from "./output";
import {Plugin} from "../plugin/plugin";

export const OPTIONS_MODULE_KIND: "ES2022" = "ES2022";
export const OPTIONS_SCRIPT_TARGET: "ES2022" = "ES2022";
export const OPTIONS_JSX: "React" = "React";

export const OPTIONS: CompilerOptions = {
    module: ModuleKind[OPTIONS_MODULE_KIND],
    moduleResolution: ModuleResolutionKind.NodeJs,
    removeComments: true,
    target: ScriptTarget[OPTIONS_SCRIPT_TARGET],
    jsx: 2,
    strict: false
}

function convert_type(kind: ts.ScriptElementKind | SyntaxKind): SymbolType {
    if (typeof kind == "number") {
        if (kind == SyntaxKind.EnumDeclaration) {
            return SymbolType.ENUM;
        }
        if (kind == SyntaxKind.InterfaceDeclaration) {
            return SymbolType.INTERFACE;
        }
        if (kind == SyntaxKind.FunctionDeclaration) {
            return SymbolType.FUNCTION;
        }
        if (kind == SyntaxKind.ClassDeclaration) {
            return SymbolType.CLASS;
        }
        if (kind == SyntaxKind.TypeAliasDeclaration) {
            return SymbolType.TYPE_ALIAS;
        }
        if (kind == SyntaxKind.VariableDeclaration) {
            return SymbolType.VARIABLE;
        }
    } else {
        switch (kind) {
            case "type":
            case "alias":
                return SymbolType.TYPE_ALIAS;
            case "class":
                return SymbolType.CLASS;
            case "interface":
            case "module":
                return SymbolType.INTERFACE;
            case "enum":
                return SymbolType.ENUM;
            case "function":
                return SymbolType.FUNCTION;
            case "var":
            case "const":
            case "let":
                return SymbolType.VARIABLE;
        }
    }

    throw "Unexpected input " + kind;
}

export function is_meta_data(type: SymbolType): boolean {
    switch (type) {
        case SymbolType.INTERFACE:
        case SymbolType.TYPE_ALIAS:
            return true;
        case SymbolType.CLASS:
        case SymbolType.ENUM:
        case SymbolType.FUNCTION:
        case SymbolType.VARIABLE:
            return false;
    }
}

export function cnstr_project(): Project {
    let project = new Project({
        compilerOptions: OPTIONS,
        skipAddingFilesFromTsConfig: true
    });

    project.getSourceFiles().forEach(value => project.removeSourceFile(value));
    return project;
}

export function add_module_item(project: Project, source: string): ModuleItem {
    let module: SourceFile = project.addSourceFileAtPath(source);
    return {
        rawFilename: source,
        filename: module.getFilePath(),
        module: module
    }
}

export function remove_imports(module: ModuleItem): void {
    module.module.getImportDeclarations().forEach(node => {
        if (node.isKind(SyntaxKind.ImportDeclaration)) {
            node.remove();
        }
    });
}


const SAVE_IMPORTS: Map<ModuleItem, ImportReference[]> = new Map<ModuleItem, ImportReference[]>();

export function extract_imports(module: ModuleItem, generateNew: boolean = false): ImportReference[] {
    if (SAVE_IMPORTS.has(module) && !generateNew) {
        return <ImportReference[]>SAVE_IMPORTS.get(module);
    }

    const imports: ImportReference[] = [];

    module.module.getImportDeclarations().forEach((node) => {
        let modified: boolean = false;


        const importPath: string = node.getModuleSpecifierValue().startsWith(".") ?
            path.join(path.dirname(module.filename), node.getModuleSpecifierValue()) :
            node.getModuleSpecifierValue();
        const from: "MODULE" | "FILE" = node.getModuleSpecifierValue().startsWith(".") ? "FILE" : "MODULE";

        if (importPath.startsWith("@tsb/")) {
            return;
        }

        if (!!node.getDefaultImport()) {
            modified = true;
            const imp: Identifier = <Identifier>node.getDefaultImport();
            imports.push({
                kind: ImportKind.DEFAULT,
                items: [{
                    name: node.getModuleSpecifierSourceFile()?.getDefaultExportSymbol()?.getName() ?? imp.getText(),
                    alias: imp.getText(),
                    type: convert_type(imp.getDefinitions()[0].getKind())
                }],
                path: importPath,
                from: from
            });
        }
        if (!!node.getNamespaceImport()) {
            modified = true;
            const imp: Identifier = <Identifier>node.getNamespaceImport();
            imports.push({
                kind: ImportKind.NAMESPACE,
                items: [{
                    name: imp.getText(),
                    alias: imp.getText(),
                    type: convert_type(imp.getDefinitions()[0].getKind())
                }],
                path: importPath,
                from: from
            });
        }
        if (node.getNamedImports().length != 0) {
            modified = true;
            const imp: ImportSpecifier[] = <ImportSpecifier[]>node.getNamedImports();
            const items: ImportReferenceItem[] = [];
            imp.forEach(value => {
                items.push({
                    name: value.getName(),
                    alias: value.getAliasNode()?.getText() ?? value.getName(),
                    type: convert_type(value.getNameNode().getDefinitions()[0].getKind())
                });
            });

            imports.push({
                kind: ImportKind.NAMED,
                items: items,
                path: importPath,
                from: from
            });
        }

        if (!modified) {
            imports.push({
                kind: ImportKind.INCLUDE,
                items: [],
                path: importPath,
                from: from
            });
        }
    });

    SAVE_IMPORTS.set(module, imports);
    return imports;
}

const SAVE_EXPORTS: Map<ModuleItem, ExportReference[]> = new Map<ModuleItem, ExportReference[]>();

export function extract_exports(module: ModuleItem): ExportReference[] {
    if (SAVE_EXPORTS.has(module)) {
        return <ExportReference[]>SAVE_EXPORTS.get(module);
    }

    const exports: ExportReference[] = [];

    const declarations: ReadonlyMap<string, ExportedDeclarations[]> = module.module.getExportedDeclarations();

    for (let [name, decs] of declarations) {
        let dec: ExportedDeclarations = decs[0];

        let local: string = name;

        if (!(dec instanceof Expression)) {
            // @ts-ignore
            local = local == "default" ? dec.getStructure().name : local;
        }

        exports.push({
            from: dec.getSourceFile().getFilePath() == module.filename ? "" : dec.getSourceFile().getFilePath(),
            local: local,
            global: name,
            type: convert_type(dec.getKind())
        });
    }

    SAVE_EXPORTS.set(module, exports);
    return exports;
}

export function remove_exports(module: ModuleItem) {
    module.module.getExportedDeclarations().forEach((value) => {
        let declaration: ExportedDeclarations = value[0];

        if (declaration instanceof VariableDeclaration) {
            (<VariableStatement>(<VariableDeclarationList>declaration.getParent()).getParent()).setIsExported(false);
        } else if (declaration instanceof ClassDeclaration) {
            declaration.setIsExported(false);
        } else if (declaration instanceof InterfaceDeclaration) {
            declaration.setIsExported(false);
        } else if (declaration instanceof EnumDeclaration) {
            declaration.setIsExported(false);
        } else if (declaration instanceof FunctionDeclaration) {
            declaration.setIsExported(false);
        } else if (declaration instanceof TypeAliasDeclaration) {
            declaration.setIsExported(false);
        }
    });

    module.module.getExportAssignments().forEach((value) => {
        value.remove();
    });

    module.module.removeDefaultExport();
}

export function compile_module(name: string, sources: string[], loaders: string[], plugins: Plugin[]): SourceFile | null {
    set_full_value(0.12);
    write_status_message("Build output");
    build_output();


    set_full_value(0.24);
    write_status_message("Init new module");
    let project: Project = cnstr_project();
    let modules: ModuleItem[] = new Array<ModuleItem>(sources.length);

    for (let i: number = 0; i < sources.length; i++) {
        set_step_value(i / sources.length);
        write_status_message(`Add '${sources[i]}' to module`);
        modules[i] = add_module_item(project, sources[i]);
    }

    set_full_value(0.36);
    write_status_message("Check diagnostics");
    if (!check_diagnostics(project)) {
        set_status("FAIL");
        return null;
    }

    fs.writeFileSync(path.join(CWD, "out", name + ".ts"), "");
    let result: SourceFile = project.addSourceFileAtPath(path.join(CWD, "out", name + ".ts"));

    set_full_value(0.48);
    write_status_message("Compile engine");
    result.addTypeAliases(build_bundler_types());
    result.addClass(build_bundler());
    result.addStatements("const bundler: Bundler = new Bundler();");

    for (let i: number = 0; i < plugins.length; i++) {
        plugins[i].generate().forEach(value => result.addClass(value));
    }

    for (let i: number = 0; i < modules.length; i++) {
        set_step_value(i / modules.length);
        write_status_message(`Extract type data in ${modules[i].rawFilename}`);
        const imports: ImportReference[] = extract_imports(modules[i]);
        const namespaceName: string = trans_to_id(modules[i].filename).slice(1, -1);

        imports.forEach(imp => {
            if (imp.from != "FILE") {
                return;
            }

            imp.items.forEach(item => {
                if (is_meta_data(item.type)) {
                    replace_type_name(modules[i], item.alias, trans_to_id(imp.path).slice(1, -1) + "." + item.name);
                }
            });
        });

        result.addStatements(writer => {
            if (modules[i].module.getInterfaces().length == 0 && modules[i].module.getTypeAliases().length == 0) {
                return;
            }

            writer.writeLine(`namespace ${namespaceName} {`);

            modules[i].module.getInterfaces().forEach(value => {
                value.setIsExported(true);
                writer.writeLine(value.getFullText());

                replace_type_name(modules[i], value.getName(), namespaceName + "." + value.getName());

                value.remove();
            });

            modules[i].module.getTypeAliases().forEach(value => {
                value.setIsExported(true);
                writer.writeLine(value.getFullText());

                replace_type_name(modules[i], value.getName(), namespaceName + "." + value.getName());

                value.remove();
            });

            writer.writeLine("}");
        });
    }

    for (let i: number = 0; i < modules.length; i++) {
        for (let k: number = 0; k < plugins.length; k++) {
            plugins[k].modify(modules[i]);
        }
    }

    set_full_value(0.60);
    for (let i: number = 0; i < modules.length; i++) {
        set_step_value(i / modules.length);
        write_status_message(`Convert '${modules[i].rawFilename}' to module item`);
        const imports: ImportReference[] = extract_imports(modules[i]);
        const exports: ExportReference[] = extract_exports(modules[i]);

        remove_imports(modules[i]);
        remove_exports(modules[i]);

        result.addStatements(writer => {
            writer.writeLine("bundler.register(");
            writer.writeLine(trans_to_id(modules[i].filename) + ",");
            let ids: string[] = [];

            imports.forEach(value => {
                if (value.from != "MODULE" && !ids.includes(trans_to_id(value.path))) {
                    ids.push(trans_to_id(value.path));
                }
            });

            writer.writeLine("[" + ids.join(",") + "],");
            writer.writeLine("(imports: BundlerImport, exports: BundlerExports, config: BundlerConfig): void => {");

            imports.forEach(value => {
                switch (value.kind) {
                    case ImportKind.DEFAULT:
                        if (is_meta_data(value.items[0].type)) {
                            return;
                        }
                        writer.write("const ");
                        writer.write(value.items[0].alias);
                        if (value.from == "MODULE") {
                            writer.writeLine(` = require["${value.path}").default;`);
                        } else {
                            writer.writeLine(` = imports[${trans_to_id(value.path)}].default;`);
                        }
                        break;
                    case ImportKind.NAMED:
                        let c: number = 0;
                        for (let item of value.items) {
                            if (!is_meta_data(item.type)) {
                                c++;
                            }
                        }

                        if (c == 0) {
                            return;
                        }

                        writer.write("const {");

                        let f: boolean = true;

                        for (let item of value.items) {
                            if (is_meta_data(item.type)) {
                                continue;
                            }
                            if (!f) {
                                writer.write(", ");
                            }
                            writer.write(item.name);
                            f = false;
                        }

                        writer.write("} = ");

                        if (value.from == "MODULE") {
                            writer.writeLine(`require("${value.path}");`);
                        } else {
                            writer.writeLine(`imports[${trans_to_id(value.path)}];`);
                        }

                        for (let item of value.items) {
                            if (is_meta_data(item.type) || item.name == item.alias) {
                                continue;
                            }

                            writer.writeLine(`const ${item.alias} = ${item.name}`);
                        }
                        break;
                    case ImportKind.NAMESPACE:
                        writer.write("const ");
                        writer.write(value.items[0].name);
                        writer.write(" = ");

                        if (value.from == "MODULE") {
                            writer.writeLine(`require("${value.path}");`);
                        } else {
                            writer.writeLine(`imports[${trans_to_id(value.path)}];`);
                        }

                        break;
                    case ImportKind.INCLUDE:
                        if (value.from == "MODULE") {
                            writer.writeLine(`require("${value.path}");`);
                        }
                        break;
                }
            });

            writer.writeLine("{")

            writer.writeLine(modules[i].module.getFullText());


            exports.forEach(value => {
                if (!is_meta_data(value.type)) {
                    writer.writeLine(`exports[${trans_to_id(modules[i].filename)}].${value.global} = ${value.local};`);
                }
            });

            writer.writeLine("}");

            writer.writeLine("});");
        });
    }

    set_full_value(0.72);
    result.addStatements(writer => {
        writer.writeLine("bundler.load(");
        loaders.forEach((value: string, index: number): void => {
            set_step_value(index / loaders.length);
            write_status_message(`Add loader of item '${trans_to_id(path.join(CWD, value))}'`);
            if (index != 0) {
                writer.writeLine(", ");
            }
            writer.write(trans_to_id(path.join(CWD, value)));
        });
        writer.writeLine("")
        writer.writeLine(");")
    });

    modules.forEach(value => {
        project.removeSourceFile(value.module);
    });

    return result;
}
