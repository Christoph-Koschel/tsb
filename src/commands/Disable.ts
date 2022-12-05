import {ArgumentHandler, Command, CommandConstructor} from "@yapm/fast-cli/1.0.0/handler";
import * as path from "path";
import {cwd} from "../utils";
import * as fs from "fs";
import * as output from "@yapm/fast-cli/1.0.0/output";

export class Disable extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        if (argv.hasFlag("--github-publish")) {
            this.disableGithubAction();
            
        }

        return 0;
    }

    disableGithubAction() {
        let githubFolder = path.join(cwd, ".github");

        if (!fs.existsSync(githubFolder) || !fs.statSync(githubFolder).isDirectory()) {
            return;
        }

        let workflowFolder = path.join(githubFolder, "workflows");

        if (!fs.existsSync(workflowFolder) || !fs.statSync(workflowFolder).isDirectory()) {
            return;
        }

        let releaseFile = path.join(workflowFolder, "release.yml");
        if (!fs.existsSync(releaseFile) || !fs.statSync(releaseFile).isFile()) {
            return;
        }

        fs.rmSync(releaseFile);
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("disable")
            .addFlag("--github-publish", true, "Disable and deletes github actions for publishing packages");
    }

    getDescription(): string {
        return "Disable tsb features";
    }

}