export const CWD: string = process.cwd();

export const ENGINE_DIR: string = "engine";
export const CONFIG_FILE: string = "tsb.config.js"

export type BuildOptions = {
    produceTS: boolean;
    option: string|false;
}

export const BUILD_OPTIONS: BuildOptions = {
    produceTS: false,
    option: false
}