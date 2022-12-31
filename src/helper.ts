import * as fs from "fs";
import * as path from "path";
import {YAPMConfig, YAPMConfigDependencies} from "@yapm/yapm/l/types";
import {load_resources, R} from "./resources";
import {cwd} from "./utils";
import * as child_process from "child_process";
import {format} from "@yapm/code-database/l/text";

export function createTSConfig(cwd: string) {
    fs.writeFileSync(path.join(cwd, "tsconfig.json"), load_resources(R.templates.ts_config_json));
}

export function getWrapper(): string {
    return load_resources(R.wrapper.bundler_js);
}

export function getResourcesWrapper(): string {
    return load_resources(R.wrapper.res_ts);
}

export function getReleaseYML(): string {
    return load_resources(R.git.release_yml);
}

export function getGitignore(): string {
    return load_resources(R.git.gitignore_txt);
}

export function getPackageJSON(name: string, author: string, version: string, license: string): string {
    return format(load_resources(R.npm.package_json), name, author, version, license);
}

export class SymbolTable {
    private files: Map<string, string>
    private config: YAPMConfig;


    public constructor(config: YAPMConfig) {
        this.files = new Map<string, string>();
        this.config = config;
    }

    public load(file: string, libCompilation: boolean, config: YAPMConfig): string {
        if (this.files.has(file)) {
            return <string>this.files.get(file);
        }

        this.files.set(file, (!this.isLib(file) && libCompilation ? config.version + "/" : "") + this.config.name + "/" + this.files.size);
        return this.load(file, libCompilation, config);
    }

    public set(file: string, value: string) {
        this.files.set(file, value);
    }

    private isLib(file: string): boolean {
        return file.startsWith("@yapm");
    }
}

export function enableGithubAction() {
    let githubFolder = path.join(cwd, ".github");

    if (!fs.existsSync(githubFolder) || !fs.statSync(githubFolder).isDirectory()) {
        fs.mkdirSync(githubFolder);
    }

    let workflowFolder = path.join(githubFolder, "workflows");

    if (!fs.existsSync(workflowFolder) || !fs.statSync(workflowFolder).isDirectory()) {
        fs.mkdirSync(workflowFolder);
    }

    fs.writeFileSync(path.join(workflowFolder, "release.yml"), getReleaseYML());
    child_process.execSync("git init");
    if (!fs.existsSync(path.join(cwd, ".gitignore")) || !fs.statSync(path.join(cwd, ".gitignore")).isFile()) {
        fs.writeFileSync(path.join(cwd, ".gitignore"), getGitignore());
    }
}

export function regeneratePathPrefixes(config: YAPMConfig): boolean {
    let tsconfig;

    try {
        tsconfig = JSON.parse(fs.readFileSync(path.join(cwd, "tsconfig.json"), "utf-8"));
    } catch (err) {
        return false;
    }

    let obj: any = {}

    let registeredPackages = [];

    for (let dependency of config.dependencies) {
        if (registeredPackages.includes(dependency.name)) {
            continue;
        }

        let last = getLastVersion(config.dependencies, dependency.name);
        registeredPackages.push(dependency.name);
        obj[`@yapm/${dependency.name}/l/*`] = [`./lib/${dependency.name}/${last}/*`];
    }

    obj["@yapm/*"] = ["./lib/*"];

    tsconfig.compilerOptions.paths = obj;
    fs.writeFileSync(path.join(cwd, "tsconfig.json"), JSON.stringify(tsconfig, null, 4));
    return true;
}

function isHigher(a: number[], b: number[]): boolean {
    if (a[0] > b[0]) {
        return false;
    }

    if (a[1] > b[1]) {
        return false;
    }

    if (a[2] > b[2]) {
        return false;
    }

    return true;
}

function splitVersionString(version: string): number[] | false {
    if (version.match(/[0-9]+\.[0-9]+\.[0-9]+\s*/g) == null) {
        return false;
    }

    let parts = version.split(".");
    let numbers: number[] = [];
    parts.forEach((value) => numbers.push(parseInt(value)));
    return numbers;
}

export function getLastVersion(dependencies: YAPMConfigDependencies[], name: string): string {
    let highest: YAPMConfigDependencies | null;

    dependencies.forEach((dependency) => {
        if (dependency.name == name) {
            if (highest == null) {
                if (splitVersionString(dependency.version)) {
                    highest = dependency;
                }
            } else {
                let a = splitVersionString(highest.version);
                let b = splitVersionString(dependency.version);
                if (!a || !b) {
                    return;
                }

                if (isHigher(a, b)) {
                    highest = dependency;
                }
            }
        }
    });

    return highest.version;
}

export function replaceAt(input: string, search: string | RegExp, replace: string, start: number) {
    return input.slice(0, start)
        + input.slice(start).replace(search, replace);
}