import {CompileModuleData, Config, CopyData, RemoveData} from "./config";
import {
    has_status,
    set_full_value,
    set_status,
    set_step_value,
    write_error, write_log,
    write_status_message,
    write_warning
} from "./output";
import * as fs from "fs";
import * as path from "path";
import {BUILD_OPTIONS, CWD, ENGINE_DIR} from "./global";
import {list_dirs, list_files} from "./utils";
import {EmitOutput, OutputFile, SourceFile} from "ts-morph";
import {compile_module} from "./transpiler";
import {Plugin, PluginHandler, PluginResultInformation} from "../plugin/plugin";
import {CompilerResult} from "./types";
import {init_translation} from "./context";

export function compile_module_task(config: Config, information: CompileModuleData): void {
    if (!!config.modules[information.moduleName]) {
        const name: string = information.moduleName;
        const sources: string[] = config.modules[information.moduleName];
        const loaders: string[] = config.loaders[information.moduleName];
        const plugins: Plugin[] = [];

        init_translation(config);

        for (let plugin of config.plugins[information.moduleName]) {
            const component: Plugin | null = PluginHandler.instantiate(plugin.name, plugin.parameters);

            if (!component) {
                write_error(`ERROR: Cannot find the plugin '${plugin.name}' found ${PluginHandler.names()}`)
                set_status("FAIL");
                return;
            }
            plugins.push(component);
        }

        const dependencyList: string[] = config.dependencies[information.moduleName] || [];
        const dependencies: string[] = [];
        dependencyList.forEach((dependency) => {
            if (!config.modules[dependency]) {
                write_error(`ERROR: Cannot find dependency '${dependency}'`);
                set_status("FAIL");
            }

            dependencies.push(dependency);
        });

        if (has_status("FAIL")) {
            return;
        }

        const result: CompilerResult | null = compile_module(name, sources, loaders, plugins, dependencies);
        if (result == null) {
            return;
        }

        set_full_value(0.84);
        if (BUILD_OPTIONS.produceTS) {
            write_status_message("Create Typescript file");
            fs.writeFileSync(result.sourceFile.getFilePath(), result.sourceFile.print());
        } else {
            fs.unlinkSync(path.join(CWD, "out", name + ".ts"));
        }

        write_status_message("Write output");
        set_full_value(0.96);
        let output: EmitOutput = result.sourceFile.getEmitOutput();

        let data: OutputFile = output.getOutputFiles().filter(value => value.getFilePath() == result.sourceFile.getFilePath().replace(path.extname(result.sourceFile.getFilePath()), ".js"))[0];
        let transformedData: string = data.getText().replace(/^export.*;$/gim, () => {
            return "";
        });

        const resultInformation: PluginResultInformation = {
            outDir: path.dirname(result.sourceFile.getFilePath()),
            outName: path.basename(data.getFilePath()),
            outPath: data.getFilePath(),
            engineDir: path.join(CWD, ENGINE_DIR),
            module: name
        }

        for (let i: number = 0; i < plugins.length; i++) {
            const transformed: string | null = plugins[i].result(transformedData, resultInformation);
            if (!!transformed) {
                transformedData = transformed;
            }
        }

        fs.writeFileSync(data.getFilePath(), transformedData);

        set_status("OK");
        return;
    }

    write_error("ERROR: Cannot find module '" + information.moduleName + "'");
    set_status("FAIL");
}

export function copy_task(information: CopyData): void {
    if (!fs.existsSync(path.join(CWD, information.from))) {
        write_error("ERROR: Cannot find item '" + information.from + "'");
        set_status("FAIL");
        return;
    }

    if (!fs.existsSync(path.join(CWD, information.to)) || !fs.statSync(path.join(CWD, information.to)).isDirectory()) {
        write_error("ERROR: Cannot find item '" + information.to + "'");
        set_status("FAIL");
        return;
    }

    if (fs.statSync(path.join(CWD, information.from)).isFile()) {
        fs.copyFileSync(path.join(CWD, information.from), path.join(CWD, information.to, path.basename(information.from)));
        set_status("OK");
        return;
    }


    if (!fs.existsSync(path.join(CWD, information.to, path.basename(information.from))) || !fs.statSync(path.join(CWD, information.to, path.basename(information.from))).isDirectory()) {
        fs.mkdirSync(path.join(CWD, information.to, path.basename(information.from)));
    }


    write_status_message("Collecting directories");
    let dirs: string[] = list_dirs(path.join(CWD, information.from));
    write_status_message("Collecting files");
    set_full_value(0.25);
    let files: string[] = list_files(path.join(CWD, information.from));

    set_full_value(0.50);
    dirs.forEach((dir: string, value: number): void => {
        set_step_value(value / dirs.length);
        write_status_message(`Create '${dir.replace(path.join(CWD, information.from), "")}'`);
        if (!fs.existsSync(dir.replace(path.join(CWD, information.from), path.join(information.to, path.basename(information.from))))) {
            fs.mkdirSync(dir.replace(path.join(CWD, information.from), path.join(information.to, path.basename(information.from))));
        }
    });

    set_full_value(0.75);
    files.forEach((file, value) => {
        set_step_value(value / files.length);
        write_status_message(`Copy '${file.replace(path.join(CWD, information.from), "")}'`);
        if (!fs.existsSync(file.replace(path.join(CWD, information.from), information.to)) || information.overwrite) {
            fs.copyFileSync(file, file.replace(path.join(CWD, information.from), path.join(information.to, path.basename(information.from))));
        }

    });

    set_status("OK");
}

export function remove_task(information: RemoveData): void {
    if (fs.existsSync(path.join(CWD, information.target))) {
        if (fs.statSync(path.join(CWD, information.target)).isFile()) {
            fs.unlinkSync(path.join(CWD, information.target));
            set_status("OK");
            return;
        }

        if (fs.statSync(path.join(CWD, information.target)).isDirectory()) {
            if (information.recursive) {
                write_status_message("Collecting folders")
                let dirs: string[] = list_dirs(path.join(CWD, information.target), false);

                set_full_value(0.25);
                write_status_message("Collecting files")
                let files: string[] = list_files(path.join(CWD, information.target));

                set_full_value(0.50);
                files.forEach((file, value) => {
                    set_step_value(value / files.length);
                    write_status_message(`Removing '${file.replace(path.join(CWD, information.target), "")}'`);
                    fs.unlinkSync(file);
                });

                set_full_value(0.75);
                dirs.forEach((dir, value) => {
                    set_step_value(value / dirs.length);
                    write_status_message(`Removing '${dir.replace(path.join(CWD, information.target), "")}'`);
                    fs.rmdirSync(dir);
                });

                set_status("OK");
                return;
            } else {
                set_status("FAIL");
                write_error("ERROR: Item to remove is a folder but recursive flag is not set");
                return;
            }
        }

        set_status("FAIL");
        write_error("ERROR: '" + information.target + "' is not a file or a folder");
        return;
    }
    write_warning("WARNING: Could not find '" + information.target + "'");
    set_status("WARNING");
}