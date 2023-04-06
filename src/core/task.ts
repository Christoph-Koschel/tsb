import {CompileModuleData, Config, CopyData, RemoveData} from "./config";
import {set_full_value, set_status, set_step_value, write_status_message} from "./output";
import {Color} from "./console";
import * as fs from "fs";
import * as path from "path";
import {BUILD_OPTIONS, CWD} from "./global";
import {list_dirs, list_files} from "./utils";
import {EmitOutput, OutputFile, SourceFile} from "ts-morph";
import {compile_module} from "./transpiler";
import {Plugin, PluginHandler, PluginResultInformation} from "../plugin/plugin";

export function compile_module_task(config: Config, information: CompileModuleData, index: number): void {
    if (!!config.modules[information.moduleName]) {
        const name: string = information.moduleName;
        const sources: string[] = config.modules[information.moduleName];
        const loaders: string[] = config.loaders[information.moduleName];
        const plugins: Plugin[] = [];

        for (let plugin of config.plugins[information.moduleName]) {
            const component: Plugin | null = PluginHandler.instantiate(plugin.name, plugin.parameters);

            if (!component) {
                write_status_message(index, `ERROR: Cannot find the plugin '${plugin.name}'`)
                set_status(index, "FAIL");
                return;
            }
            plugins.push(component);
        }

        const result: SourceFile = compile_module(name, sources, loaders, plugins, index);

        set_full_value(index, 84);
        if (BUILD_OPTIONS.produceTS) {
            write_status_message(index, "Create Typescript file");
            fs.writeFileSync(result.getFilePath(), result.print());
        } else {
            fs.unlinkSync(path.join(CWD, "out", name + ".ts"));
        }

        write_status_message(index, "Write output");
        set_full_value(index, 96);
        let output: EmitOutput = result.getEmitOutput();

        let data: OutputFile = output.getOutputFiles().filter(value => value.getFilePath() == result.getFilePath().replace(path.extname(result.getFilePath()), ".js"))[0];
        let transformedData: string = data.getText().replace(/^export.*;$/gim, () => {
            return "";
        });

        const resultInformation: PluginResultInformation = {
            outDir: path.dirname(result.getFilePath()),
            outName: path.basename(data.getFilePath()),
            outPath: data.getFilePath()
        }

        for (let i: number = 0; i < plugins.length; i++) {
            const transformed: string | null = plugins[i].result(transformedData, resultInformation);
            if (!!transformed) {
                transformedData = transformed;
            }
        }

        fs.writeFileSync(data.getFilePath(), transformedData);

        set_status(index, "OK");
        return;
    }

    write_status_message(index, "ERROR: Cannot find module '" + information.moduleName + "'", Color.Red);
    set_status(index, "FAIL");
}

export function copy_task(information: CopyData, index: number): void {
    if (!fs.existsSync(path.join(CWD, information.from))) {
        write_status_message(index, "ERROR: Cannot find item '" + information.from + "'", Color.Red);
        set_status(index, "FAIL");
        return;
    }

    if (!fs.existsSync(path.join(CWD, information.to)) || !fs.statSync(path.join(CWD, information.to)).isDirectory()) {
        write_status_message(index, "ERROR: Cannot find item '" + information.to + "'", Color.Red);
        set_status(index, "FAIL");
        return;
    }

    if (fs.statSync(path.join(CWD, information.from)).isFile()) {
        fs.copyFileSync(path.join(CWD, information.from), path.join(CWD, information.to, path.basename(information.from)));
        set_status(index, "OK");
        return;
    }


    if (!fs.existsSync(path.join(CWD, information.to, path.basename(information.from))) || !fs.statSync(path.join(CWD, information.to, path.basename(information.from))).isDirectory()) {
        fs.mkdirSync(path.join(CWD, information.to, path.basename(information.from)));
    }


    write_status_message(index, "Collecting directories");
    let dirs: string[] = list_dirs(path.join(CWD, information.from));
    write_status_message(index, "Collecting files");
    set_full_value(index, 25);
    let files: string[] = list_files(path.join(CWD, information.from));

    set_full_value(index, 50);
    dirs.forEach((dir: string, value: number): void => {
        set_step_value(index, Math.round(value * 100 / files.length));
        write_status_message(index, `Create '${dir.replace(path.join(CWD, information.from), "")}'`);
        if (!fs.existsSync(dir.replace(path.join(CWD, information.from), path.join(information.to, path.basename(information.from))))) {
            fs.mkdirSync(dir.replace(path.join(CWD, information.from), path.join(information.to, path.basename(information.from))));
        }
    });

    set_full_value(index, 75);
    files.forEach((file, value) => {
        set_step_value(index, Math.round(value * 100 / files.length));
        write_status_message(index, `Copy '${file.replace(path.join(CWD, information.from), "")}'`);
        if (!fs.existsSync(file.replace(path.join(CWD, information.from), information.to)) || information.overwrite) {
            fs.copyFileSync(file, file.replace(path.join(CWD, information.from), path.join(information.to, path.basename(information.from))));
        }

    });

    set_status(index, "OK");
}

export function remove_task(information: RemoveData, index: number): void {
    if (fs.existsSync(path.join(CWD, information.target))) {
        if (fs.statSync(path.join(CWD, information.target)).isFile()) {
            fs.unlinkSync(path.join(CWD, information.target));
            set_status(index, "OK");
            return;
        }

        if (fs.statSync(path.join(CWD, information.target)).isDirectory()) {
            if (information.recursive) {
                write_status_message(index, "Collecting folders")
                let dirs: string[] = list_dirs(path.join(CWD, information.target), false);

                set_full_value(index, 25);
                write_status_message(index, "Collecting files")
                let files: string[] = list_files(path.join(CWD, information.target));

                set_full_value(index, 50);
                files.forEach((file, value) => {
                    set_step_value(index, Math.round(value * 100 / files.length));
                    write_status_message(index, `Removing '${file.replace(path.join(CWD, information.target), "")}'`);
                    fs.unlinkSync(file);
                });

                set_full_value(index, 75);
                dirs.forEach((dir, value) => {
                    set_step_value(index, Math.round(value * 100 / dirs.length));
                    write_status_message(index, `Removing '${dir.replace(path.join(CWD, information.target), "")}'`);
                    fs.rmdirSync(dir);
                });

                set_status(index, "OK");
                return;
            } else {
                set_status(index, "FAIL");
                write_status_message(index, "ERROR: Item to remove is a folder but recursive flag is not set", Color.Red);
                return;
            }
        }

        set_status(index, "FAIL");
        write_status_message(index, "ERROR: '" + information.target + "' is not a file or a folder", Color.Red);
        return;
    }
    write_status_message(index, "WARNING: Could not find '" + information.target + "'", Color.Yellow);
    set_status(index, "WARNING");
}