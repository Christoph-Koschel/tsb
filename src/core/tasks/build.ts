import {BUILD_OPTIONS, CONFIG_FILE, CWD} from "../global";
import * as path from "path";
import * as fs from "fs";
import {CompileModuleData, Config, CopyData, QueueDataGroup, QueueEntry, QueueKind, RemoveData} from "../config";
import {Color, colorize, has_status, init_queue_status, set_active, set_status, write_title} from "../output";
import {shift} from "../utils";
import {compile_module_task, copy_task, remove_task} from "../task";

function prebuild(): Config {
    let arg: string | null = null;

    while (typeof (arg = shift()) == "string") {
        if (arg == "--write-ts") {
            BUILD_OPTIONS.produceTS = true;
        }
    }

    const configPath: string = path.join(CWD, CONFIG_FILE);
    if (!fs.existsSync(configPath) || !fs.statSync(configPath).isFile()) {
        console.log(colorize("ERROR: Cannot find 'tsb.config.js'. Are you in the right directory?", Color.Red));
        process.exit(1);
    }

    let config: Config = require(path.join(CWD, CONFIG_FILE)).default;
    if (config == null) {
        console.log(colorize("ERROR: No config object is exported as default", Color.Red));
        process.exit(1);
    }
    return config;
}

export default function build(): void {
    const config: Config = prebuild();
    init_queue_status(config.queue);

    config.queue.forEach((value: QueueEntry<QueueDataGroup>, index: number): void => {
        set_active(index);
        if (value.kind == QueueKind.COMPILE_MODULE) {
            write_title(`Compile '${(<CompileModuleData>value.information).moduleName}'`);
        } else if (value.kind == QueueKind.COPY) {
            write_title(`Copy '${(<CopyData>value.information).from}'`);
        } else if (value.kind == QueueKind.REMOVE) {
            write_title(`Remove '${(<RemoveData>value.information).target}'`);
        }
    });

    let hasErrors: boolean = false;

    config.queue.forEach((value: QueueEntry<QueueDataGroup>, index: number): void => {
        set_active(index);
        set_status("DOING");
        if (value.kind == QueueKind.COMPILE_MODULE) {
            const information: CompileModuleData = value.information as CompileModuleData;
            compile_module_task(config, information);
        } else if (value.kind == QueueKind.COPY) {
            const information: CopyData = value.information as CopyData;

            copy_task(information);
        } else if (value.kind == QueueKind.REMOVE) {
            const information: RemoveData = value.information as RemoveData;
            remove_task(information);
        }
        if (!hasErrors) {
            hasErrors = has_status("FAIL");
        }
    });

    process.exit(hasErrors ? 1 : 0);
}