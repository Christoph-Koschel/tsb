import * as fs from "fs";
import * as path from "path";

export type Serializable =
// primitive data types
    number
    | boolean
    | string
    // serialization class
    | Serialization
    // arrays
    | number[]
    | boolean[]
    | string[]
    | Serialization[]
    // objects
    | { [KEY in string]: Serializable };

export type Config = {
    modules: { [Name in string]: string[] };
    loaders: { [Name in string]: string[] };
    plugins: { [Name in string]: PluginInformation[] };
    queues: { [Name in string]: Queue<QueueDataGroup> };
}

export type PluginInformation = {
    name: string;
    parameters: Serializable[];
}

export enum QueueKind {
    COMPILE_MODULE,
    COPY,
    REMOVE,
    SYNC_PLUGIN
}

export type QueueDataGroup = CopyData | RemoveData | CompileModuleData | SyncPluginData;

export type CopyData = {
    from: string;
    to: string;
    overwrite: boolean;
}

export type RemoveData = {
    target: string;
    recursive: boolean;
}

export type CompileModuleData = {
    moduleName: string;
}

export type SyncPluginData = {}

export type Queue<T> = QueueEntry<T>[];

export type QueueEntry<T> = {
    kind: QueueKind;
    information: T;
}

export abstract class Serialization {

    /***
     * Convert a json object to its child class
     * @param data
     */
    public abstract serialize(data: { [key in string]: Serializable }): void;

    /***
     * Convert a object to a json object
     */
    public abstract deserialize(): { [key in string]: Serializable };
}

export class QueueBuilder {
    private readonly from: ConfigBuilder;

    private queue: Queue<QueueDataGroup>;
    private name: string;

    public constructor(from: ConfigBuilder, name: string) {
        this.from = from;
        this.name = name;
        this.queue = [];
    }

    public compile_module(module: string): this {
        this.queue.push({
            kind: QueueKind.COMPILE_MODULE,
            information: {
                moduleName: module
            }
        });

        return this;
    }

    public remove(path: string, recursive: boolean = false): this {
        this.queue.push({
            kind: QueueKind.REMOVE,
            information: {
                target: path,
                recursive: recursive
            }
        });

        return this;
    }

    public copy(from: string, to: string, overwrite: boolean = false): this {
        this.queue.push({
            kind: QueueKind.COPY,
            information: {
                from: from,
                to: to,
                overwrite: overwrite
            }
        });

        return this;
    }

    public done(): ConfigBuilder {
        this.from.set_queue(this.name, this.queue);

        return this.from;
    }
}

export class ConfigBuilder {
    private modules: Map<string, string[]>;
    private loaders: Map<string, string[]>;
    private plugins: Map<string, PluginInformation[]>;
    private queues: Map<string, Queue<QueueDataGroup>>

    constructor() {
        this.modules = new Map<string, string[]>();
        this.loaders = new Map<string, string[]>();
        this.plugins = new Map<string, PluginInformation[]>();
        this.queues = new Map<string, Queue<QueueDataGroup>>();
    }

    private current: string | null = null;

    public add_module(name: string, paths: string[]): this {
        let convertedPaths: string[] = []

        paths.forEach(value => {
            const loop = (root: string) => {

                fs.readdirSync(root).forEach(item => {
                    const itemPath: string = path.join(root, item);
                    if (fs.statSync(itemPath).isFile() && (itemPath.endsWith(".tsx") || itemPath.endsWith(".ts"))) {
                        convertedPaths.push(itemPath);
                    } else if (fs.statSync(itemPath).isDirectory()) {
                        loop(itemPath);
                    }
                });
            }

            if (!fs.existsSync(value)) {
                console.log(`WARNING: The path '${value}' dont exist`);
                return;
            }

            if (fs.statSync(value).isFile()) {
                convertedPaths.push(value);
            } else if (fs.statSync(value).isDirectory()) {
                loop(value);
            }
        });

        this.modules.set(name, convertedPaths);
        this.loaders.set(name, []);
        this.plugins.set(name, []);
        this.current = name;

        return this;
    }

    public select_module(name: string): this {
        if (this.modules.has(name)) {
            this.current = name;
        } else {
            console.log(`ERROR: The module '${name}' dont exist`);
            process.exit(1);
        }

        return this;
    }

    public add_loader(path: string): this {
        if (!fs.existsSync(path)) {
            console.log(`WARNING: The path '${path}' dont exist`);
        }

        if (this.current == null) {
            console.log("ERROR: No module selected at 'add_loader'\nAt one with 'add_module' or select one with 'select_module'");
            process.exit(1);
        }
        if (!this.loaders.has(this.current)) {
            this.loaders.set(this.current, [path]);
        } else {
            (<string[]>this.loaders.get(this.current)).push(path);
        }

        return this;
    }

    public use(name: string, ...parameters: Serializable[]): this {
        if (this.current == null) {
            console.log("ERROR: No module selected at 'use'\nAt one with 'add_module' or select one with 'select_module'");
            process.exit(1);
        }

        if (!this.plugins.has(this.current)) {
            this.plugins.set(this.current, [
                {
                    name: name,
                    parameters: parameters
                }
            ]);
        } else {
            (<PluginInformation[]>this.plugins.get(this.current)).push({
                name: name,
                parameters: parameters
            });
        }

        return this;
    }

    public create_build_queue(name: string = "all"): QueueBuilder {
        return new QueueBuilder(this, name);
    }

    public set_queue(name: string, queue: Queue<QueueDataGroup>): void {
        this.queues.set(name, queue);
    }

    public build(): Config {
        let modules: { [Name in string]: string[] } = {};

        this.modules.forEach((value, key) => {
            modules[key] = value;
        });

        let loaders: { [Name in string]: string[] } = {};

        this.loaders.forEach((value, key) => {
            loaders[key] = value;
        });

        let plugins: { [Name in string]: PluginInformation[] } = {};

        this.plugins.forEach((value, key) => {
            plugins[key] = value;
        });

        if (this.queues.size == 0) {
            const queue: Queue<QueueDataGroup> = []

            this.modules.forEach((value, key) => {
                // @ts-ignore
                queue.push({
                    kind: QueueKind.COMPILE_MODULE,
                    information: {
                        moduleName: key
                    }
                });

                this.queues.set("all", queue);
            });
        }

        const queues: { [Name in string]: Queue<QueueDataGroup> } = {};
        this.queues.forEach((value, key) => {
            queues[key] = value;
        });

        return {
            queues: queues,
            modules: modules,
            loaders: loaders,
            plugins: plugins
        }
    }

    public write(filePath: string): void {
        const config: Config = this.build();

        const plugins: { [Key in string]: PluginInformation[] } = {};
        for (let pluginKey in config.plugins) {
            plugins[pluginKey] = [];
            config.plugins[pluginKey].forEach(information => {
                const parameters: Serializable[] = [];

                information.parameters.forEach(value => {
                    if (value instanceof Serialization) {
                        parameters.push(value.deserialize());
                    } else {
                        parameters.push(value);
                    }
                });

                plugins[pluginKey].push({
                    name: information.name,
                    parameters: parameters
                });
            });
        }

        fs.writeFileSync(filePath, JSON.stringify({
            modules: config.modules,
            loaders: config.loaders,
            queues: config.queues,
            plugins: plugins
        }, null, 4));
    }
}

export const PLUGINS: {
    UTILS: {
        MINIFIER: "tsb.minifier",
        SHEBANG: "tsb.shebang",
        TSX: "tsb.tsx"
    }
} = {
    UTILS: {
        MINIFIER: "tsb.minifier",
        SHEBANG: "tsb.shebang",
        TSX: "tsb.tsx"
    }
}