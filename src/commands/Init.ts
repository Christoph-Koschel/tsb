import {ArgumentHandler, Command, CommandConstructor} from "@yapm/fast-cli/l/handler";
import {decision, readline} from "@yapm/fast-cli/l/input";
import {writeConfig} from "@yapm/yapm/l/project";
import {cwd} from "../utils";
import {createTSConfig, enableGithubAction, getPackageJSON} from "../helper";
import * as fs from "fs";
import * as path from "path";

export class Init extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        process.stdout.write("Name: ");
        let name = await readline();

        process.stdout.write("Author: ");
        let author = await readline();

        process.stdout.write("Version (1.0.0): ");
        let version = await readline();
        version = version == "" ? "1.0.0" : version;

        process.stdout.write("License (MIT): ");
        let license = await readline();
        license = license == "" ? "MIT" : license;

        process.stdout.write("Create Git-Action for publishment? (y|n)");
        let gitAction = await decision();

        process.stdout.write("Create package.json? (y|n)");
        let packageJSON = await decision();

        writeConfig(cwd, {
            name: name,
            author: author,
            version: version,
            license: license,
            dependencies: []
        });

        if (gitAction) {
            enableGithubAction();
            process.stdout.write("Notice the remote repository must have the same name as your project\n");
        }

        if (packageJSON) {
            fs.writeFileSync(path.join(cwd, "package.json"), getPackageJSON(name, author, version, license));
        }

        createTSConfig(cwd);

        if (!fs.existsSync(path.join(cwd, "src")) || fs.statSync(path.join(cwd, "src")).isFile()) {
            fs.mkdirSync(path.join(cwd, "src"));
        }
        if (!fs.existsSync(path.join(cwd, "lib")) || fs.statSync(path.join(cwd, "lib")).isFile()) {
            fs.mkdirSync(path.join(cwd, "lib"));
        }

        return 0;
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("init");
    }

    getDescription(): string {
        return "Inits a new tsb project";
    }
}