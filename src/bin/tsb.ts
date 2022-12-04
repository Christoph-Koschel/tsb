#!/usr/bin/env node
import {CLI} from "@yapm/fast-cli/1.0.0/parser";
import * as output from "@yapm/fast-cli/1.0.0/output";
import {Colors} from "@yapm/fast-cli/1.0.0/output";
import {Init} from "../commands/Init";
import {Compile} from "../commands/Compile";
import {Generate} from "../commands/Generate";

const cli = new CLI(process.argv);
output.set_colors(Colors.CYAN, Colors.RED, Colors.GRAY);

cli.register(new Init());
cli.register(new Compile());
cli.register(new Generate());

cli.exec().then((c) => {
    process.exit(c);
});