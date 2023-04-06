import {SourceFile} from "ts-morph";

export type ModuleItem = {
    rawFilename: string;
    filename: string;
    module: SourceFile;
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
