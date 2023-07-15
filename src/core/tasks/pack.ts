import * as path from "path";
import {BUILD_OPTIONS, CONFIG_FILE, CWD} from "../global";
import * as fs from "fs";
import {Color, colorize, has_status, init_queue_status, set_active, set_status, write_title} from "../output";
import {CompileModuleData, Config, PackData, Queue, QueueDataGroup, QueueKind} from "../config";
import {shift} from "../utils";
import {compile_module_task, pack_module_task} from "../task";

function prepack(): Config {
    let arg: string | null = null;
    while (typeof (arg = shift()) == "string") {
        BUILD_OPTIONS.option = arg;
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
        console.log(colorize("ERROR: No module declared", Color.Red));
        process.exit(1);
    }

    if (!Object.keys(config.modules).includes(BUILD_OPTIONS.option)) {
        console.log(colorize(`ERROR: Module '${BUILD_OPTIONS.option}' is not defined`, Color.Red))
        process.exit(1);
    }

    if (config.moduleType[BUILD_OPTIONS.option] != "lib") {
        console.log(colorize(`ERROR: Module '${BUILD_OPTIONS.option}' is not a libary`, Color.Red))
        process.exit(1);
    }

    return config;
}

export default function pack(): void {
    const config: Config = prepack();

    const queue: Queue<QueueDataGroup> = [
        {
            kind: QueueKind.COMPILE_MODULE,
            information: {
                moduleName: BUILD_OPTIONS.option
            }
        },
        {
            kind: QueueKind.PACK,
            information: {
                moduleName: BUILD_OPTIONS.option
            }
        }
    ];

    init_queue_status(queue);

    set_active(1);
    write_title(`Pack '${(<PackData>queue[0].information).moduleName}'`);
    set_active(0);
    write_title(`Compile '${(<CompileModuleData>queue[0].information).moduleName}'`);
    set_status("DOING");
    compile_module_task(config, <CompileModuleData>queue[0].information);

    if (has_status("FAIL")) {
        set_active(1);
        set_status("FAIL");
        process.exit(1);
    }


    set_active(1);
    set_status("DOING");
    pack_module_task(<PackData>queue[1].information);
}