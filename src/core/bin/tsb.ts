#!/usr/bin/env node
import {shift} from "../utils";
import build from "../tasks/build";
import sync from "../tasks/sync";
import init from "../tasks/init";

if (__dirname.endsWith("bin")) {
    require("../../utils/utils");
}

function usage(): void {
    console.log("Usage tsb <command> [<options>]");
    console.log();
    console.log("build [<options>]");
    console.log("--write-ts  Write the typescript file to the output (This file is not 100% syntax secure).");
    console.log();
    console.log("sync [<options>]");
    console.log();
    console.log("init [<options>]");
    console.log();
    console.log("help [<options>]");
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
} else if (command == "help") {
    usage();
}