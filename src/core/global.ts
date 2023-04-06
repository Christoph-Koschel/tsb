export const CWD: string = process.cwd();
export const CONFIG_FILE: string = "tsb.config.js"

export type BuildOptions = {
    produceTS: boolean;
}

export const BUILD_OPTIONS: BuildOptions = {
    produceTS: false
}