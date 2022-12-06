import {ArgumentHandler, Command, CommandConstructor} from "@yapm/fast-cli/l/handler";
import {enableGithubAction, getGitignore, getReleaseYML} from "../helper";

export class Enable extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        if (argv.hasFlag("--github-publish")) {
            enableGithubAction();
            process.stdout.write("Notice the remote repository must have the same name as your project\n");
        }

        return 0;
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("enable")
            .addFlag("--github-publish", true, "Enable and build github actions for publishing packages");
    }

    getDescription(): string {
        return "Enable tsb features";
    }
}