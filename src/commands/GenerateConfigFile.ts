import {ArgumentHandler, Command, CommandConstructor} from "@yapm/fast-cli/1.0.0/handler";
import {cwd} from "../utils";
import {getResourcesWrapper, regeneratePathPrefixes} from "../helper";
import {readConfig} from "@yapm/yapm/1.0.1/project";

export class GenerateConfigFile extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        let config = readConfig(cwd);

        if (!regeneratePathPrefixes(config)) {
            process.stdout.write("Could not regenerate tsconfig paths");
            return 1;
        }

        return 0;
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("generate")
            .addFlag("--config", true, "Regenerates the config files");
    }

    getDescription(): string {
        return "Regenerates the config files";
    }
}