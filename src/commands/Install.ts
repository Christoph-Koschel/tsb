import {installPackage} from "@yapm/yapm/l/packages";
import {ArgumentHandler, Command, CommandConstructor} from "@yapm/fast-cli/l/handler";
import {readConfig} from "@yapm/yapm/l/project";
import {cwd, outputStream} from "../utils";
import * as output from "@yapm/fast-cli/l/output";
import * as fs from "fs";
import * as path from "path";
import {regeneratePathPrefixes} from "../helper";

export class Install extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        let config = readConfig(cwd);

        if (argv.hasAttr("-p")) {
            const packageFile = <string>argv.getAttr("-p");
            const username: string | undefined = argv.hasAttr("-u") ? argv.getAttr("-u") : undefined;
            const version: string | undefined = argv.hasAttr("-v") ? argv.getAttr("-v") : undefined;

            await installPackage({
                packageName: packageFile,
                username: username,
                version: version
            }, cwd, argv.hasFlag("--no-depend"), outputStream);

            if (!regeneratePathPrefixes(config)) {
                output.writeln_error("Could not regenerate tsconfig paths");
                return 1;
            }

            return 0;
        }


        if (fs.existsSync(path.join(cwd, "lib")) && fs.statSync(path.join(cwd, "lib")).isDirectory()) {
            fs.rmSync(path.join(cwd, "lib"), {recursive: true});
        }

        output.writeln_log("Reinstall a packages");

        for (let dependency of config.dependencies) {
            await installPackage({
                packageName: dependency.resolve
            }, cwd, argv.hasFlag("--no-depend"), outputStream);
        }

        if (!regeneratePathPrefixes(config)) {
            output.writeln_error("Could not regenerate tsconfig paths");
            return 1;
        }

        return 0;
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("install")
            .addAttribute("-p", "package", true, "The package for installation")
            .addAttribute("-u", "user", true, "The username (is for example needed for GitHub)")
            .addAttribute("-v", "version", true, "The version of the package")
            .addFlag("-depend", true, "Dont install dependencies of te package");
    }

    getDescription(): string {
        return "Install a package";
    }
}