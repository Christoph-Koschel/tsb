import * as  fs from "fs";
import * as path from "path";
import {CWD} from "./global";

function check_dir(p: string): boolean {
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
        return true;
    }

    return false;
}

export function build_output(): void {
    if (!check_dir(path.join(CWD, "out"))) {
        fs.mkdirSync(path.join(CWD, "out"));
    }
}