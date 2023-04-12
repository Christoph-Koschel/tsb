import * as path from "path";
import {BUILD_OPTIONS, CONFIG_FILE, CWD, ENGINE_DIR} from "../global";
import * as fs from "fs";
import {Config, CopyData, Queue, QueueDataGroup, QueueEntry, QueueKind, RemoveData} from "../config";
import {Color, colorize, has_status, init_queue_status, set_active, set_status, write_error} from "../output";
import {copy_task, remove_task} from "../task";
import {Plugin, PluginHandler, PluginResultInformation} from "../../plugin/plugin";

export default function sync(): void {
    const configPath: string = path.join(CWD, CONFIG_FILE);
    if (!fs.existsSync(configPath) || !fs.statSync(configPath).isFile()) {
        console.log(colorize("ERROR: Cannot find 'tsb.config.js'. Are you in the right directory?", Color.Red));
        process.exit(1);
    }

    let config: Config = require(path.join(CWD, CONFIG_FILE)).default;
    if (config == null) {
        console.log(colorize("ERROR: No config object is exported as default", Color.Red));
        process.exit(1);
        return;
    }

    if (!BUILD_OPTIONS.option) {
        if (Object.keys(config).length < 1) {
            console.log(colorize("ERROR: No option is declared", Color.Red));
            process.exit(1);
        }

        BUILD_OPTIONS.option = Object.keys(config)[0];
    }
    let queue: Queue<QueueDataGroup> = config.queues[BUILD_OPTIONS.option];

    if (!queue) {
        console.log(colorize(`ERROR: The option '${BUILD_OPTIONS.option}' is not declared in your config file`, Color.Red));
        process.exit(1);
    }

    queue = queue.filter(value => value.kind != QueueKind.COMPILE_MODULE);

    queue.unshift({
        kind: QueueKind.SYNC_PLUGIN,
        information: {}
    });

    init_queue_status(queue);

    let hasErrors: boolean = false;
    queue.forEach((value: QueueEntry<QueueDataGroup>, index: number) => {
        set_active(index);
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
                        write_error(`ERROR: Cannot find the plugin '${plugin.name}' found ${PluginHandler.names()}`);
                        set_status("FAIL");
                        hasErrors = true;
                        return;
                    }
                    component.sync(information);
                    seenPlugins.push(component.name);
                }
            }
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