import {ArgumentHandler, Command, CommandConstructor} from "@yapm/fast-cli/1.0.0/handler";
import {decision, readline} from "@yapm/fast-cli/1.0.0/input";
import {writeConfig} from "@yapm/yapm/1.0.0/project";
import {cwd} from "../utils";
import {createTSConfig} from "../helper";
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

        process.stdout.write("Create Git Action for publishment?");
        let gitAction = await decision();

        writeConfig(cwd, {
            name: name,
            author: author,
            version: version,
            license: license,
            dependencies: []
        });

        if (gitAction) {
            let githubFolder = path.join(cwd, ".github");

            if (!fs.existsSync(githubFolder) || !fs.statSync(githubFolder).isDirectory()) {
                fs.mkdirSync(githubFolder);
            }

            let workflowFolder = path.join(githubFolder, "workflows");

            if (!fs.existsSync(workflowFolder) || !fs.statSync(workflowFolder).isDirectory()) {
                fs.mkdirSync(workflowFolder);
            }


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