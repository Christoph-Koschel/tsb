import {uninstallPackage} from "@yapm/yapm/l/packages";
import {ArgumentHandler, Command, CommandConstructor} from "@yapm/fast-cli/l/handler";
import {readConfig, writeConfig} from "@yapm/yapm/l/project";
import {cwd} from "../utils";
import {YAPMConfig} from "@yapm/yapm/l/types";
import {regeneratePathPrefixes} from "../helper";
import * as output from "@yapm/fast-cli/l/output";

export class UnInstall extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        const name = argv.getAttr("-p");
        const version = argv.getAttr("-v");
        const config: YAPMConfig = readConfig(cwd);

        for (let i = 0; i < config.dependencies.length; i++) {
            let dependency = config.dependencies[i];
            if (dependency.name == name && dependency.version == version) {
                uninstallPackage(cwd, name, version);
                config.dependencies = config.dependencies.slice(i, 1);
            }
        }

        writeConfig(cwd, config);
        if (!regeneratePathPrefixes(config)) {
            output.writeln_error("Could not regenerate tsconfig paths");
            return 1;
        }
        return 0;
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("uninstall")
            .addAttribute("-p", "package", false, "The package name for uninstallation")
            .addAttribute("-v", "version", false, "The package version for uninstallation");
    }

    getDescription(): string {
        return "Uninstall a package";
    }

}
