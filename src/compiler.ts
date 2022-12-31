import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as output from "@yapm/fast-cli/l/output";
import {replaceAt} from "./helper";

const importObjRegex = /(import\s{1,}{.*}\s{1,}from\s*".*"\s*;)|(import\s{1,}{.*}\s{1,}from\s".{1,}")/gi;
const importBundleRegex = /(import\s{1,}\*\s{1,}as\s{1,}\w{1,}\s{1,}from\s{1,}".*"\s*;)|(import\s*\*\s{1,}as\s{1,}\w{1,}\s{1,}from\s{1,}".*")/gi;
const importDefaultRegex = /(import\s{1,}\w{1,}\s{1,}from\s{1,}".*"\s*;)|(import\s{1,}\w{1,}\s{1,}from\s{1,}".*")/gi;
const importRegex = /(import\s*".*"\s*;)|(import\s*".*")/gi;
const exportRegex = /export\s{1,}\w{1,}\s{1,}\w{1,}/gi;
const exportDefaultRegex = /export\s{1,}default\s{1,}\w{1,}\s{1,}\w{1,}/gi;
const exportAsyncRegex = /export\s{1,}async\s{1,}function\s{1,}\w{1,}/gi;
const exportNoneRegex = /(export\s{1,}\{}\s*;)|(export\s{1,}\{};)/gi

export interface ImportType {
    types: string[];
    src: string;
    importType: "file" | "lib" | "npm";
    importResult: "obj" | "bundle" | "default" | "load";
    file: string;
}

export interface ExportType {
    name: string;
    exportType: "default" | "normal";
    file: string;
}

export type OverWriteResult = [string, string, ImportType[], ExportType[]]

export function overwriteFiles(files: string[]): [boolean, OverWriteResult[]] {
    let content: OverWriteResult[] = [];
    let shBang: boolean = false;
    output.writeln_log("Prepare files");
    files.forEach((file, index, array) => {
        let [_shBang, res] = overwriteFile(file);
        if (_shBang) {
            shBang = true;
        }
        content.push(res);
        output.writeln_log(`Prepare [${index + 1}|${array.length}] "${file}"`, true);
    });

    return [shBang, content];
}

function extractImports(content: string, file: string): [string, ImportType[]] {
    let match: RegExpMatchArray | null;
    let imports: ImportType[] = [];

    match = content.match(importObjRegex);
    if (match != null) {
        match.forEach((include) => {
            content = content.replace(include, "");

            let items: RegExpMatchArray | null = include.match(/{.*}/gi);
            if (items != null) {
                let types: string[] = items[0].substring(1, items[0].length - 1).split(",");
                for (let i = 0; i < types.length; i++) {
                    types[i] = types[i].trim();
                }

                items = include.match(/".*"/gi);

                if (items != null) {
                    let item: string = items[0].substring(1, items[0].length - 1);
                    let src: string;
                    let type: "file" | "lib" | "npm";

                    if (item.startsWith("@yapm")) {
                        type = "lib";
                        src = item;
                    } else if (item.startsWith(".") || path.isAbsolute(item)) {
                        src = path.join(path.dirname(file), item) + ".js";
                        type = "file";
                    } else {
                        type = "npm";
                        src = item;
                    }

                    imports.push({
                        src: src,
                        importType: type,
                        importResult: "obj",
                        types: types,
                        file: file
                    });
                }
            }
        });
    }

    match = content.match(importBundleRegex);
    if (match != null) {
        match.forEach((include) => {
            content = content.replace(include, "");

            let nameReg: RegExpMatchArray = <RegExpMatchArray>include.match(/import\s*\*\s*as\s*\w*/gi);
            let name: string = <string>nameReg[0].split(" ").pop();

            let items: RegExpMatchArray | null = include.match(/".*"/gi);

            if (items != null) {
                let item: string = items[0].substring(1, items[0].length - 1);
                let src: string;
                let type: "file" | "lib" | "npm";

                if (item.startsWith("@yapm")) {
                    type = "lib";
                    src = item;
                } else if (item.startsWith(".") || path.isAbsolute(item)) {
                    src = path.join(path.dirname(file), item) + ".js";
                    type = "file";
                } else {
                    type = "npm";
                    src = item;
                }

                imports.push({
                    src: src,
                    importType: type,
                    importResult: "bundle",
                    types: [name],
                    file: file
                });

            }
        });
    }

    match = content.match(importDefaultRegex);
    if (match != null) {
        match.forEach((include) => {
            content = content.replace(include, "");

            let nameReg: RegExpMatchArray = <RegExpMatchArray>include.match(/import\s*\w*/gi);
            let name: string = <string>nameReg[0].split(" ").pop();

            let items: RegExpMatchArray | null = include.match(/".*"/gi);

            if (items != null) {
                let item: string = items[0].substring(1, items[0].length - 1);
                let src: string;
                let type: "file" | "lib" | "npm";

                if (item.startsWith("@yapm")) {
                    type = "lib";
                    src = item;
                } else if (item.startsWith(".") || path.isAbsolute(item)) {
                    src = path.join(path.dirname(file), item) + ".js";
                    type = "file";
                } else {
                    type = "npm";
                    src = item;
                }

                imports.push({
                    src: src,
                    importType: type,
                    importResult: "default",
                    types: [name],
                    file: file
                });

            }
        });
    }

    match = content.match(importRegex);
    if (match != null) {
        match.forEach((include) => {
            content = content.replace(include, "");
            let items = include.match(/".*"/gi);
            if (items != null) {
                let item = items[0].substring(1, items[0].length - 1);
                let src: string;
                let type: "file" | "lib" | "npm";

                if (item.startsWith("@yapm")) {
                    type = "lib";
                    src = item;
                } else if (item.startsWith(".") || path.isAbsolute(item)) {
                    src = path.join(path.dirname(file), item) + ".js";
                    type = "file";
                } else {
                    type = "npm";
                    src = item;
                }

                imports.push({
                    src: src,
                    importType: type,
                    importResult: "load",
                    types: [],
                    file: file
                })
            }
        });
    }
    return [content, imports];
}

function extractExports(content: string, file: string): [string, ExportType[]] {
    let match: RegExpMatchArray | null;
    let exports: ExportType[] = [];

    match = content.match(exportDefaultRegex);
    if (match != null) {
        match.forEach((exclude) => {
            let index = content.search(exclude);
            content = replaceAt(content, /export\s{1,}default\s{1,}/gi, "", index);
            let words = exclude.split(" ");
            exports.push({
                name: words[words.length - 1].trim(),
                exportType: "default",
                file: file
            });
        });
    }

    match = content.match(exportAsyncRegex);
    if (match != null) {
        match.forEach((exclude) => {
            let index = content.search(exclude);
            content = replaceAt(content, /export\s{1,}/gi, "", index);
            let words = exclude.split(" ");
            exports.push({
                name: words[words.length - 1].trim(),
                exportType: "normal",
                file: file
            });
        });
    }

    match = content.match(exportRegex);
    if (match != null) {
        match.forEach((exclude) => {
            let index = content.search(exclude);
            content = replaceAt(content, /export\s{1,}/gi, "", index);
            let words = exclude.split(" ");
            exports.push({
                name: words[words.length - 1].trim(),
                exportType: "normal",
                file: file
            });
        });
    }

    match = content.match(exportNoneRegex);
    if (match != null) {
        match.forEach((exclude) => {
            let index = content.search(exclude);
            content = replaceAt(content, exclude, "", index);
        });
    }
    return [content, exports];
}

export function overwriteFile(file: string): [boolean, OverWriteResult] {
    let content = fs.readFileSync(file, "utf8");
    let shBang = false;
    let match: RegExpMatchArray | null = content.match(/^\s*#!.*/g);
    if (match != null) {
        match.forEach(value => {
            content = content.replace(value, "");
        });
        shBang = true;
    }

    let [_, imports] = extractImports(content, file);
    content = _;
    let [__, exports] = extractExports(content, file);
    content = __;
    return [shBang, [file, content, imports, exports]];
}

export function moveOneIn(content: string): string {
    const lines = content.split(os.EOL);

    let c = "";
    lines.forEach(value => c += "\t" + value + os.EOL);

    return c;
}