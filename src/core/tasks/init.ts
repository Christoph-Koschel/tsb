import {OPTIONS_JSX, OPTIONS_MODULE_KIND, OPTIONS_SCRIPT_TARGET} from "../transpiler";
import * as fs from "fs";
import * as path from "path";
import {CWD, ENGINE_DIR} from "../global";

function make_folder(dir: string): void {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
        fs.mkdirSync(dir);
    }
}

export default function init(): void {
    fs.writeFileSync(path.join(CWD, "tsconfig.json"), JSON.stringify({
        compilerOptions: {
            module: OPTIONS_MODULE_KIND,
            moduleResolution: "Node",
            removeComments: true,
            target: OPTIONS_SCRIPT_TARGET,
            jsx: OPTIONS_JSX,
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
    fs.copyFileSync(path.join(__dirname, "assets", "tsb.config.js"), path.join(CWD, "tsb.config.js"));
}