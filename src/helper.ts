import * as fs from "fs";
import * as path from "path";
import {YAPMConfig} from "@yapm/yapm/1.0.1/types";
import {load_resources, R} from "./resources";

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