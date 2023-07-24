import {SourceFile} from "ts-morph";

export type ModuleItem = {
    rawFilename: string;
    filename: string;
    module: SourceFile;
}

export type CompilerResult = {
    name: string;
    sourceFile: SourceFile;
    file_map: { [file: string]: string }
}

export enum SymbolType {
    FUNCTION,
    VARIABLE,
    INTERFACE,
    TYPE_ALIAS,
    CLASS,
    ENUM
}

export enum ImportKind {
    DEFAULT,
    NAMED,
    NAMESPACE,
    INCLUDE
}

export type ImportReferenceItem = {
    name: string;
    alias: string;
    type: SymbolType;
}

export type ImportReference = {
    path: string;
    items: ImportReferenceItem[];
    kind: ImportKind;

    from: "MODULE" | "FILE";
}

export type ExportReference = {
    from: string;
    local: string;
    global: string;
    type: SymbolType;
}

export type LibConfig = {
    name: string;
    scripts: string[];
    assets: { src: string, dest: string }[];
}

export enum LibIncludeType {
    SCRIPT,
    ASSET
}

export type LibScriptIncludeItem = {
    type: LibIncludeType.SCRIPT;
    src: string;
    vdest: string;
}

export type LibAssetIncludeItem = {
    type: LibIncludeType.ASSET;
    src: string;
    vdest: string;
    dest: string;
}

export type LibIncludeItem = LibScriptIncludeItem | LibAssetIncludeItem;