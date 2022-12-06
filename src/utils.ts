import {YAPMConfig} from "@yapm/yapm/l/types";

export const cwd: string = process.cwd();

export interface TSBConfig extends YAPMConfig {
    copy?: { [key: string]: string }
}