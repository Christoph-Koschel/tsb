import {OutputStream, YAPMConfig} from "@yapm/yapm/l/types";
import * as output from "@yapm/fast-cli/l/output";

export const cwd: string = process.cwd();

export const outputStream: OutputStream = {
    error(data: string) {
        output.writeln_error(data);
    },
    log(data: string) {
        output.writeln_log(data);
    },
    warning(data: string) {
        output.writeln_info(data);
    }
}

export interface TSBConfig extends YAPMConfig {
    copy?: { [key: string]: string }
}

