import * as AdmZip from "adm-zip";
import * as fs from "fs";
import {shift} from "../utils";
import {BUILD_OPTIONS, CWD} from "../global";
import {Color, colorize} from "../output";
import * as path from "path";
import {LibConfig} from "../types";
import * as https from "https";

function preuse(): void {
    let arg: string | null = null;
    while (typeof (arg = shift()) == "string") {
        BUILD_OPTIONS.option = arg;
    }
}

export default function use(): void {
    preuse();

    if (!BUILD_OPTIONS.option) {
        return;
    }

    if (BUILD_OPTIONS.option.startsWith("http://") || BUILD_OPTIONS.option.startsWith("https://")) {
        console.log("Try downloading file");
        https.get(BUILD_OPTIONS.option, (res) => {
            const buffers: Buffer[] = [];

            res.on('readable', function () {
                for (; ;) {
                    let buffer = res.read();
                    if (!buffer) {
                        break;
                    }
                    buffers.push(buffer);
                }
            });
            res.on('end', function () {
                const buffer: Buffer = Buffer.concat(buffers);

                const zip: AdmZip = new AdmZip(buffer);
                extract_file(zip);
            });
        });

        return;
    } else if (!fs.existsSync(<string>BUILD_OPTIONS.option) || !fs.statSync(<string>BUILD_OPTIONS.option).isFile()) {
        console.log(colorize(`ERROR: File '${BUILD_OPTIONS.option}' dont exists`, Color.Red));
        process.exit(1);
    }

    const zip: AdmZip = new AdmZip(<string>BUILD_OPTIONS.option);
    extract_file(zip);
}

export function extract_file(zip: AdmZip): void {
    try {
        function copy_folder(dir: string, dest: string): void {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest);
            }

            fs.readdirSync(dir).forEach((entry) => {
                if (fs.statSync(path.join(dir, entry)).isFile()) {
                    fs.copyFileSync(path.join(dir, entry), path.join(dest, entry));
                } else if (fs.statSync(path.join(dir, entry)).isDirectory()) {
                    copy_folder(path.join(dir, entry), path.join(dest, entry));
                }
            });
        }

        if (!fs.existsSync(path.join(CWD, "lib"))) {
            fs.mkdirSync(path.join(CWD, "lib"));
        }
        zip.extractAllTo(path.join(CWD, "cash"));
        const lib: LibConfig = JSON.parse(fs.readFileSync(path.join(CWD, "cash", "lib.json"), "utf-8"));
        if (!fs.existsSync(path.join(CWD, "lib", lib.name))) {
            fs.mkdirSync(path.join(CWD, "lib", lib.name));
        }

        fs.copyFileSync(path.join(CWD, "cash", lib.name + ".js"), path.join(CWD, "lib", lib.name, lib.name + ".js"));
        lib.scripts.forEach((script) => {
            fs.copyFileSync(path.join(CWD, "cash", script), path.join(CWD, "lib", lib.name, path.basename(script)));
        });

        lib.assets.forEach((asset) => {
            if (!fs.existsSync(path.join(CWD, asset.dest)) || !fs.statSync(path.join(CWD, asset.dest)).isDirectory()) {
                fs.mkdirSync(path.join(CWD, asset.dest), {recursive: true});
            }

            fs.copyFileSync(path.join(CWD, "cash", asset.src), path.join(CWD, asset.dest, path.basename(asset.src)));
        });

        fs.copyFileSync(path.join(CWD, "cash", lib.name + ".fm.json"), path.join(CWD, "lib", lib.name, lib.name + ".fm.json"));

        copy_folder(path.join(CWD, "cash", "header"), path.join(CWD, "lib", lib.name));
    } catch {
        console.log("Library is corrupted");
    }
}