#!/usr/bin/env node
import {shift} from "../utils";
import build from "../tasks/build";
import sync from "../tasks/sync";
import init from "../tasks/init";
import pack from "../tasks/pack";
import use from "../tasks/use";
import * as path from "path";
import * as fs from "fs";

if (__dirname.endsWith("bin")) {
    require("../../utils/utils");
} else {
    fs.readdirSync(path.join(__dirname, "plugins")).forEach((item) => {
        if (item.endsWith(".js")) {
            require(path.join(__dirname, "plugins", item));
        }
    });
}

function usage(): void {
    console.log("Usage: tsb <command> [<options>]");
    console.log();
    console.log("build [<queue>] [<options>]");
    console.log();
    console.log("Builds the project with a in the config file defined build queue or at default all defined modules");
    console.log();
    console.log("queue:")
    console.log("  Your config name defined in your config file");
    console.log("options:");
    console.log("  --write-ts  Write the typescript file to the output (This file is not 100% syntax secure).");
    console.log();
    console.log("sync [<queue>]");
    console.log();
    console.log("Syncs the project with the settings and plugins set in the config file");
    console.log();
    console.log("queue:")
    console.log("  Your config name defined in your config file");
    console.log();
    console.log("init");
    console.log();
    console.log("Inits a new project");
    console.log();
    console.log("options:");
    console.log("  (--plugin | -p) Inits a project for plugin development");
    console.log();
    console.log("pack <module>");
    console.log();
    console.log("Packs a module to a zip library for easy transfer and usage");
    console.log();
    console.log("module:")
    console.log("  The module that should be packed");
    console.log();
    console.log("use <path>");
    console.log();
    console.log("Includes a library in the current project");
    console.log();
    console.log("path:")
    console.log("  The path of the library");
    console.log();
    console.log("help");
}

// Remove node and file path
shift();
shift();

const command: string | null = shift();
if (!command) {
    usage();
    process.exit(1);
}

if (command == "build") {
    build();
} else if (command == "sync") {
    sync();
} else if (command == "init") {
    init();
} else if (command == "pack") {
    pack();
} else if (command == "use") {
    use();
} else if (command == "help") {
    usage();
}