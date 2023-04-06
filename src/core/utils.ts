import * as fs from "fs";
import * as path from "path";
export function list_files(dir: string): string[] {
    const files: string[] = [];

    const loop = (dir: string): void => {
        fs.readdirSync(dir).forEach(value => {
            if (fs.statSync(path.join(dir, value)).isDirectory()) {
                loop(path.join(dir, value));
            } else if (fs.statSync(path.join(dir, value)).isFile()) {
                files.push(path.join(dir, value));
            }
        });
    }
    loop(dir);


    return files;
}

export function list_dirs(dir: string, growing: boolean = true): string[] {
    const dirs: string[] = [];

    const loop = (dir: string): void => {
        fs.readdirSync(dir).forEach(value => {
            if (fs.statSync(path.join(dir, value)).isDirectory()) {
                if (growing) {
                    dirs.push(path.join(dir, value));
                }
                loop(path.join(dir, value));
                if (!growing) {
                    dirs.push(path.join(dir, value));
                }
            }
        });
    }
    loop(dir);

    return dirs;
}

let id: number = 0;

export function shift(): string | null {
    if (id >= process.argv.length) {
        return null;
    }

    return process.argv[id++];
}
