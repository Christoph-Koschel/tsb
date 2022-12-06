import {ArgumentHandler, Command, CommandConstructor} from "@yapm/fast-cli/l/handler";
import {cwd} from "../utils";
import * as path from "path";
import * as fs from "fs";
import * as output from "@yapm/fast-cli/l/output";
import * as child_process from "child_process";
import {readConfig, writeConfig} from "@yapm/yapm/l/project";
import {YAPMConfig} from "@yapm/yapm/l/types";

export class Publish extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        let config: YAPMConfig = readConfig(cwd);

        let githubFolder = path.join(cwd, ".github");
        if (!fs.existsSync(githubFolder) || !fs.statSync(githubFolder).isDirectory()) {
            output.writeln_error("Publishment to GitHub is not enabled");
            output.writeln_error("To enable it enter: tsb enable --github-publish", true);
            return 1;
        }

        let workflowFolder = path.join(githubFolder, "workflows");
        if (!fs.existsSync(workflowFolder) || !fs.statSync(workflowFolder).isDirectory()) {
            output.writeln_error("Publishment to GitHub is not enabled");
            output.writeln_error("To enable it enter: tsb enable --github-publish", true);
            return 1;
        }

        let releaseFile = path.join(workflowFolder, "release.yml");
        if (!fs.existsSync(releaseFile) || !fs.statSync(releaseFile).isFile()) {
            output.writeln_error("Publishment to GitHub is not enabled");
            output.writeln_error("To enable it enter: tsb enable --github-publish", true);
            return 1;
        }

        let increment = argv.getAttr("-v");
        if (increment.match(/([0-9]+|x)\.([0-9]+|x)\.([0-9]+|x)\s*/g) == null) {
            output.writeln_error("Increment has the wrong format");
            return 1;
        }

        let increments: number[] = [];
        let allX: boolean = true;

        for (const value of increment.split(".")) {
            if (value == "x") {
                increments.push(0);
                continue;
            }

            let x;
            if (!isNaN((x = parseInt(value)))) {
                if (x <= 0) {
                    output.writeln_error("Cannot increment with zero");
                    return 1;
                }

                increments.push(x);
                allX = false;
            } else {
                output.writeln_error("Undefined number \"" + value + "\" in increment");
                return 1;
            }
        }

        if (allX) {
            output.writeln_error("Increment string must contain at least one number");
            return 1;
        }

        let versions: number[] = [];

        for (const value of config.version.split(".")) {
            let x;
            if (!isNaN((x = parseInt(value)))) {
                versions.push(x);
            } else {
                output.writeln_error("Undefined number \"" + value + "\" in config version");
                return 1;
            }
        }

        if (config.version.match(/[0-9]+\.[0-9]+\.[0-9]+\s*/g) == null) {
            output.writeln_error("config version has the wrong format");
            return 1;
        }

        let force = argv.hasFlag("--force");

        output.writeln_log("git => Commit update " + config.version);
        if (!await this.executeCMD(`git commit -a -m "Create release ${config.version}"`)) {
            if (!force) {
                return 1;
            }
        }

        output.writeln_log("git => Commit push " + config.version);
        if (!await this.executeCMD(`git push`)) {
            if (!force) {
                return 1;
            }
        }

        output.writeln_log("git => Create tag " + config.version);
        if (!await this.executeCMD("git tag " + config.version)) {
            if (!force) {
                return 1;
            }
        }
        output.writeln_log("git => Push tags");
        if (!await this.executeCMD("git push --tags")) {
            if (!force) {
                return 1;
            }
        }

        let newVersion = "";
        for (let i = 0; i < versions.length; i++) {
            if (i != 0) {
                newVersion += ".";
            }

            if (increments[i] != 0 && i + 1 < versions.length) {
                versions[i + 1] = 0;
            }

            newVersion += versions[i] + increments[i];
        }
        output.writeln_log(`Updated ${config.version} -> ${newVersion}`);
        config.version = newVersion;
        writeConfig(cwd, config);

        return 0;
    }

    private async executeCMD(cmd: string): Promise<boolean> {
        return new Promise(resolve => {
            child_process.exec(cmd, (error, stdout, stderr) => {
                if (!!error && !!error.code && error.code == 1) {
                    output.writeln_error("Could not execute \"" + cmd + "\"");
                    output.writeln_error("Message: " + error.message, true);
                    output.writeln_error("         " + stdout, true);
                    resolve(false);
                }

                resolve(true);
            });
        });
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("publish")
            .addFlag("--github", false, "Publish to GitHub")
            .addAttribute("-v", "version", false, "Increment the version of your project e.g. before = 1.4.0 increment = x.x.1 after = 1.4.1, before 1.4.1 increment = x.1.x after = 1.5.0")
            .addFlag("--force", true, "Force a release generation");
    }

    getDescription(): string {
        return "Publish the project to GitHub when github release is enabled";
    }
}