import {BUILD_OPTIONS, CONFIG_FILE, CWD} from "../global";
import * as path from "path";
import * as fs from "fs";
import {Console} from "../console";
import {CompileModuleData, Config, CopyData, QueueDataGroup, QueueEntry, QueueKind, RemoveData} from "../config";
import {init_queue_status, set_status} from "../output";
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
        Console.write_error("ERROR: Cannot find 'tsb.config.js'. Are you in the right directory?", true);
    }

    let config: Config = require(path.join(CWD, CONFIG_FILE)).default;
    if (config == null) {
        Console.write_error("ERROR: No config object is exported as default", true);
    }
    return config;
}

export default function build(): void {
    const config: Config = prebuild();
    init_queue_status(config.queue);

    config.queue.forEach((value: QueueEntry<QueueDataGroup>, index: number): void => {
        set_status(index, "DOING");
        if (value.kind == QueueKind.COMPILE_MODULE) {
            const information: CompileModuleData = value.information as CompileModuleData;
            compile_module_task(config, information, index);
        } else if (value.kind == QueueKind.COPY) {
            const information: CopyData = value.information as CopyData;

            copy_task(information, index);
        } else if (value.kind == QueueKind.REMOVE) {
            const information: RemoveData = value.information as RemoveData;
            remove_task(information, index);
        }
    });

    Console.dispose();
}