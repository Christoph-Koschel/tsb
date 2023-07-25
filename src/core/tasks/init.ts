import {OPTIONS_JSX, OPTIONS_MODULE_KIND, OPTIONS_SCRIPT_TARGET} from "../transpiler";
import * as fs from "fs";
import * as path from "path";
import {CWD, ENGINE_DIR} from "../global";
import {PluginHandler} from "../plugin";
import * as AdmZip from "adm-zip";
import {extract_file} from "./use";

function make_folder(dir: string): void {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
        fs.mkdirSync(dir);
    }
}

function generate_plugin_file(plugins: string[]): { ts: string, js: string } {
    const obj: any = {};

    plugins.forEach(plugin => {
        const parts = plugin.split(".");

        const each = (remain: string[], obj: any) => {
            if (remain.length == 1) {
                obj[(<string>remain.shift()).toUpperCase()] = plugin;
                return;
            }

            const part: string = <string>remain.shift();
            if (!obj[part.toUpperCase()]) {
                obj[part.toUpperCase()] = {};
            }
            each(remain, obj[part.toUpperCase()]);
        }
        each(parts, obj)
    });

    const to_string = (obj: any, space: number, last: boolean): string => {
        let str: string = "{\n";
        space += 4;

        Object.keys(obj).forEach((key, index, array) => {
            if (typeof obj[key] == "object") {
                str += " ".repeat(space) + key + ": ";
                str += to_string(obj[key], space, index == array.length - 1);
            } else {
                str += " ".repeat(space) + key + `: "${obj[key]}"` + (index == array.length - 1 ? "\n" : ",\n");
            }
        });

        space -= 4;
        str += " ".repeat(space) + "}" + (last ? "\n" : ",\n");
        return str;
    }

    return {
        ts: `export declare const PLUGINS: ${to_string(obj, 0, true)}`,
        js: `"use strict"\nObject.defineProperty(exports, "__esModule", { value: true });\nexports.PLUGINS = ${to_string(obj, 0, true)}`
    }
}

export default function init(): void {
    const pluginProject: boolean = process.argv.includes("--plugin") || process.argv.includes("-p");

    fs.writeFileSync(path.join(CWD, "tsconfig.json"), JSON.stringify({
        compilerOptions: {
            module: OPTIONS_MODULE_KIND,
            moduleResolution: "Node",
            removeComments: true,
            target: OPTIONS_SCRIPT_TARGET,
            allowJs: false,
            lib: [
                "ES2022",
                "DOM"
            ],
            paths: {
                "@tsb/engine": [
                    "./engine/engine.d.ts"
                ],
                "@lib/*": [
                    "./lib/*.d.ts"
                ]
            }
        },
        exclude: [
            "node_modules",
            "out"
        ]
    }, null, 4));

    make_folder("lib");
    make_folder(ENGINE_DIR);
    fs.copyFileSync(path.join(__dirname, "assets", "config.d.ts"), path.join(CWD, ENGINE_DIR, "config.d.ts"));
    fs.copyFileSync(path.join(__dirname, "assets", "config.js"), path.join(CWD, ENGINE_DIR, "config.js"));
    fs.copyFileSync(path.join(__dirname, "assets", "engine.d.ts"), path.join(CWD, ENGINE_DIR, "engine.d.ts"));
    fs.copyFileSync(path.join(__dirname, "assets", "engine.d.ts"), path.join(CWD, ENGINE_DIR, "engine.d.ts"));

    if (pluginProject) {
        fs.writeFileSync(path.join(CWD, "tsb.config.js"), fs.readFileSync(path.join(__dirname, "assets", "plugin.config.js"), "utf8").replace(/<@OUTPUT@>/gi, path.join(__dirname, "plugins").replace(/\\/gi, "/")));
    } else {
        fs.copyFileSync(path.join(__dirname, "assets", "tsb.config.js"), path.join(CWD, "tsb.config.js"));
    }


    const plugins: { ts: string; js: string } = generate_plugin_file(PluginHandler.names().split(", "));

    fs.writeFileSync(path.join(CWD, ENGINE_DIR, "plugins.d.ts"), plugins.ts);
    fs.writeFileSync(path.join(CWD, ENGINE_DIR, "plugins.js"), plugins.js);

    if (pluginProject) {
        const zip: AdmZip = new AdmZip(path.join(__dirname, "assets", "tsb.lib.zip"));
        extract_file(zip);
    }
}


