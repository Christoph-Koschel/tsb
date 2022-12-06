#!/usr/bin/env node

import {CLI} from "@yapm/fast-cli/l/parser";
import * as output from "@yapm/fast-cli/1.0.0/output";
import {Colors} from "@yapm/fast-cli/1.0.0/output";
import {Init} from "../commands/Init";
import {Compile} from "../commands/Compile";
import {GenerateAssetFile} from "../commands/GenerateAssetFile";
import {Publish} from "../commands/Publish";
import {Enable} from "../commands/Enable";
import {Disable} from "../commands/Disable";
import {Install} from "../commands/Install";
import {UnInstall} from "../commands/Uninstall";
import {GenerateConfigFile} from "../commands/GenerateConfigFile";

const cli = new CLI(process.argv);
output.set_colors(Colors.CYAN, Colors.RED, Colors.GRAY);

cli.register(new Init());
cli.register(new Compile());
cli.register(new GenerateAssetFile());
cli.register(new Publish());
cli.register(new Enable());
cli.register(new Disable());
cli.register(new Install());
cli.register(new UnInstall());
cli.register(new GenerateConfigFile());

cli.exec().then((c) => {
    process.exit(c);
});