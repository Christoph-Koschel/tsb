import {BUILD_OPTIONS, CONFIG_FILE, CWD} from "../global";
import * as path from "path";
import * as fs from "fs";
import {
    CompileModuleData,
    Config,
    CopyData, Queue,
    QueueDataGroup,
    QueueEntry,
    QueueKind,
    RemoveData
} from "../config";
import {Color, colorize, has_status, init_queue_status, set_active, set_status, write_title} from "../output";
import {shift} from "../utils";
import {compile_module_task, copy_task, remove_task} from "../task";
import {ObjectLiteralElement} from "ts-morph";

function prebuild(): Config {
    let arg: string | null = null;

    while (typeof (arg = shift()) == "string") {
        if (arg == "--write-ts") {
            BUILD_OPTIONS.produceTS = true;
        } else {
            BUILD_OPTIONS.option = arg;
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

    if (!BUILD_OPTIONS.option) {
        if (Object.keys(config.queues).length < 1) {
            console.log(colorize("ERROR: No option is declared", Color.Red));
            process.exit(1);
        }

        BUILD_OPTIONS.option = Object.keys(config.queues)[0];
    }

    return config;
}

export default function build(): void {
    const config: Config = prebuild();
    const queue: Queue<QueueDataGroup> = config.queues[<string>BUILD_OPTIONS.option];

    if (!queue) {
        console.log(colorize(`ERROR: The option '${BUILD_OPTIONS.option}' is not declared in your config file`, Color.Red));
        process.exit(1);
    }

    init_queue_status(queue);

    queue.forEach((value: QueueEntry<QueueDataGroup>, index: number): void => {
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

    queue.forEach((value: QueueEntry<QueueDataGroup>, index: number): void => {
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