import * as path from "path";
import {CONFIG_FILE, CWD} from "../global";
import * as fs from "fs";
import {Console} from "../console";
import {Config, CopyData, Queue, QueueDataGroup, QueueKind, RemoveData, QueueEntry} from "../config";
import {init_queue_status} from "../output";
import {copy_task, remove_task} from "../task";

export default function sync(): void {
    const configPath: string = path.join(CWD, CONFIG_FILE);
    if (!fs.existsSync(configPath) || !fs.statSync(configPath).isFile()) {
        Console.write_error("ERROR: Cannot find 'tsb.config.js'. Are you in the right directory?", true);
    }

    let config: Config = require(path.join(CWD, CONFIG_FILE)).default;
    if (config == null) {
        Console.write_error("ERROR: No config object is exported as default", true);
    }

    const queue: Queue<QueueDataGroup> = config.queue.filter(value => value.kind != QueueKind.COMPILE_MODULE);
    init_queue_status(queue);

    queue.forEach((value: QueueEntry<QueueDataGroup>, index: number) => {
        if (value.kind === QueueKind.COPY) {
            const information: CopyData = value.information as CopyData;
            copy_task(information, index);
        } else if (value.kind === QueueKind.REMOVE) {
            const information: RemoveData = value.information as RemoveData;
            remove_task(information, index);
        }
    });
}