import * as path from "path";
import {CONFIG_FILE, CWD, ENGINE_DIR} from "../global";
import * as fs from "fs";
import {Console} from "../console";
import {Config, CopyData, Queue, QueueDataGroup, QueueEntry, QueueKind, RemoveData} from "../config";
import {init_queue_status, set_status, write_status_message} from "../output";
import {copy_task, remove_task} from "../task";
import {Plugin, PluginHandler, PluginResultInformation} from "../../plugin/plugin";

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

    queue.unshift({
        kind: QueueKind.SYNC_PLUGIN,
        information: {}
    });

    init_queue_status(queue);

    queue.forEach((value: QueueEntry<QueueDataGroup>, index: number) => {
        if (value.kind == QueueKind.SYNC_PLUGIN) {
            const seenPlugins: string[] = [];

            const information: PluginResultInformation = {
                outDir: path.join(CWD, "out"),
                outName: "",
                outPath: "",
                engineDir: path.join(CWD, ENGINE_DIR)
            }

            for (let module in config.modules) {
                for (let plugin of config.plugins[module]) {
                    if (seenPlugins.includes(plugin.name)) {
                        continue;
                    }
                    const component: Plugin | null = PluginHandler.instantiate(plugin.name, plugin.parameters);

                    if (!component) {
                        write_status_message(index, `ERROR: Cannot find the plugin '${plugin.name}' found ${PluginHandler.names()}`)
                        set_status(index, "FAIL");
                        return;
                    }
                    component.sync(information);
                    seenPlugins.push(component.name);
                }
            }
        } else if (value.kind == QueueKind.COPY) {
            const information: CopyData = value.information as CopyData;
            copy_task(information, index);
        } else if (value.kind == QueueKind.REMOVE) {
            const information: RemoveData = value.information as RemoveData;
            remove_task(information, index);
        }
    });
}