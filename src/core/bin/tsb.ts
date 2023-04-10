#!/usr/bin/env node

import {Console} from "../console";
import {shift} from "../utils";
import build from "../tasks/build";
import sync from "../tasks/sync";
import init from "../tasks/init";

if (__dirname.endsWith("bin")) {
    require("../../utils/utils");
}

Console.init();

function usage(): void {
    Console.writeLine("Usage tsb <command> [<options>]");
    Console.writeLine("");
    Console.writeLine("build [<options>]");
    Console.writeLine("--write-ts  Write the typescript file to the output (This file is not 100% syntax secure).");
    Console.writeLine("");
    Console.writeLine("sync [<options>]");
    Console.writeLine("");
    Console.writeLine("init [<options>]");
    Console.writeLine("");
    Console.writeLine("help [<options>]");
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

Console.dispose();