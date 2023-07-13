import {ClassDeclarationStructure, Scope, StructureKind, TypeAliasDeclarationStructure} from "ts-morph";

export function build_bundler_types(): TypeAliasDeclarationStructure[] {
    return [
        {
            kind: StructureKind.TypeAlias,
            name: "BundlerImport",
            type: "{ [key in (string)]: any }"
        },
        {
            kind: StructureKind.TypeAlias,
            name: "BundlerExports",
            type: "{ [key in (string)]: any }"
        },
        {
            kind: StructureKind.TypeAlias,
            name: "BundlerConfig",
            type: "{ pragma: \"once\" | \"multiple\" }"
        },
        {
            kind: StructureKind.TypeAlias,
            name: "BundlerModule",
            type: "{ (imports: BundlerImport, exports: BundlerExports, config: BundlerConfig): void }"
        },
        {
            kind: StructureKind.TypeAlias,
            name: "BundlerStorage",
            type: "{ config: BundlerConfig | {}; imports: string[]; module: BundlerModule; }"
        },
    ]
}

export function build_bundler(): ClassDeclarationStructure {
    return {
        kind: StructureKind.Class,
        name: "Bundler",
        ctors: [
            {
                parameters: [
                    {
                        kind: StructureKind.Parameter,
                        name: "name",
                        type: "string"
                    }
                ],
                kind: StructureKind.Constructor,
                statements: writer => {
                    writer.writeLine("this.modules = new Map<string, BundlerStorage>();");
                    writer.writeLine("this.loaded = new Map<string, BundlerExports>();");
                    writer.writeLine("this.name = name");
                }
            }
        ],
        properties: [
            {
                kind: StructureKind.Property,
                name: "modules",
                type: "Map<string, BundlerStorage>",
                scope: Scope.Private
            },
            {
                kind: StructureKind.Property,
                name: "loaded",
                type: "Map<string, BundlerExports>",
                scope: Scope.Private
            },
            {
                kind: StructureKind.Property,
                name: "name",
                type: "string",
                scope: Scope.Private
            }
        ],
        methods: [
            {
                kind: StructureKind.Method,
                name: "register",
                parameters: [
                    {
                        kind: StructureKind.Parameter,
                        name: "id",
                        type: "string"
                    },
                    {
                        kind: StructureKind.Parameter,
                        name: "requires",
                        type: "string[]"
                    },
                    {
                        kind: StructureKind.Parameter,
                        name: "module",
                        type: "BundlerModule"
                    }
                ],
                returnType: "void",
                statements: writer => {
                    writer.writeLine("this.modules.set(id, {");
                    writer.writeLine("config: {},");
                    writer.writeLine("imports: requires,");
                    writer.writeLine("module: module");
                    writer.writeLine("});");
                },
                scope: Scope.Public
            },
            {
                kind: StructureKind.Method,
                name: "load",
                parameters: [
                    {
                        kind: StructureKind.Parameter,
                        name: "items",
                        type: "string[]",
                        isRestParameter: true
                    }
                ],
                returnType: "void",
                statements: writer => {
                    writer.writeLine("for (let i = 0; i < items.length; i++) {");
                    writer.writeLine("const [status] = this.loadItem(items[i]);");
                    writer.writeLine("if (!status) {");
                    writer.writeLine("return;");
                    writer.writeLine("}}")
                },
                scope: Scope.Public
            },
            {
                kind: StructureKind.Method,
                name: "loadItem",
                parameters: [
                    {
                        kind: StructureKind.Parameter,
                        name: "item",
                        type: "string"
                    }
                ],
                returnType: "[boolean, BundlerExports]",
                statements: writer => {
                    writer.writeLine("if (!this.modules.has(item)) {");
                    writer.writeLine('let domain: string = item.split("_")[0]');
                    writer.writeLine("if (typeof window == \"undefined\") {");
                    writer.writeLine("if (typeof global[\"domain\"] == \"undefined\") {");
                    writer.writeLine("console.error(`BUNDLER: Cannot resolve '${item}'`);");
                    writer.writeLine("return [false, []];");
                    writer.writeLine("}");
                    writer.writeLine(`if (global["domain"][domain] == "undefined") {`);
                    writer.writeLine("console.error(`BUNDLER: Cannot resolve '${item}'`);");
                    writer.writeLine("return [false, []];");
                    writer.writeLine("} else {");
                    writer.writeLine("return global[\"domain\"][domain].loadItem(item);");
                    writer.writeLine("}");
                    writer.writeLine("} else {");
                    writer.writeLine("if (typeof window[\"domain\"] == \"undefined\") {");
                    writer.writeLine("console.error(`BUNDLER: Cannot resolve '${item}'`);");
                    writer.writeLine("return [false, []];");
                    writer.writeLine("}");
                    writer.writeLine(`if (window["domain"][domain] == "undefined") {`);
                    writer.writeLine("console.error(`BUNDLER: Cannot resolve '${item}'`);");
                    writer.writeLine("return [false, []];");
                    writer.writeLine("} else {");
                    writer.writeLine("return window[\"domain\"][domain].loadItem(item);");
                    writer.writeLine("}");
                    writer.writeLine("}");
                    writer.writeLine("}");
                    writer.writeLine("if (this.loaded.has(item)) {");
                    writer.writeLine("return [true, this.loaded.get(item)];");
                    writer.writeLine("}");
                    writer.writeLine("const module: BundlerStorage = this.modules.get(item);");
                    writer.writeLine("let imports: BundlerImport = {};");
                    writer.writeLine("let exports: BundlerExports = {};");
                    writer.writeLine("exports[item] = {}");
                    writer.writeLine("let config: BundlerConfig = {");
                    writer.writeLine("pragma: \"once\"");
                    writer.writeLine("};");
                    writer.writeLine("module.imports.forEach(subitem => {");
                    writer.writeLine("const [status, exports] = this.loadItem(subitem);");
                    writer.writeLine("if (!status) {");
                    writer.writeLine("console.error(`BUNDLER: Could not load reference '${subitem}' in ${item}`);");
                    writer.writeLine("return;");
                    writer.writeLine("}");
                    writer.writeLine("imports[subitem] = exports[subitem];");
                    writer.writeLine("});");
                    writer.writeLine("module.module(imports, exports, config);");
                    writer.writeLine("if (config.pragma == \"once\") {");
                    writer.writeLine("this.loaded.set(item, exports);");
                    writer.writeLine("}");
                    writer.writeLine("return [true, exports];");
                },
                scope: Scope.Public
            }
        ]
    }
}