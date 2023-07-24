export declare type Serializable = number | boolean | string | Serialization | number[] | boolean[] | string[] | Serialization[] | {
    [KEY in string]: Serializable;
};
export declare type Config = {
    modules: {
        [Name in string]: string[];
    };
    loaders: {
        [Name in string]: string[];
    };
    dependencies: {
        [Name in string]: string[];
    };
    moduleType: {
        [Name in string]: BuildType;
    };
    plugins: {
        [Name in string]: PluginInformation[];
    };
    queues: {
        [Name in string]: Queue<QueueDataGroup>;
    };
};
export declare type PluginInformation = {
    name: string;
    parameters: Serializable[];
};
export declare enum QueueKind {
    COMPILE_MODULE = 0,
    COPY = 1,
    REMOVE = 2,
    SYNC_PLUGIN = 3,
    PACK = 4
}
export declare type QueueDataGroup = CopyData | RemoveData | CompileModuleData | SyncPluginData | PackData;
export declare type CopyData = {
    from: string;
    to: string;
    overwrite: boolean;
};
export declare type RemoveData = {
    target: string;
    recursive: boolean;
};
export declare type CompileModuleData = {
    moduleName: string;
};
export declare type PackData = {
    moduleName: string;
};
export declare type SyncPluginData = {};
export declare type Queue<T> = QueueEntry<T>[];
export declare type QueueEntry<T> = {
    kind: QueueKind;
    information: T;
};
export declare type BuildType = "lib" | "module";
export declare abstract class Serialization {
    abstract serialize(data: {
        [key in string]: Serializable;
    }): void;
    abstract deserialize(): {
        [key in string]: Serializable;
    };
}
export declare class QueueBuilder {
    private readonly from;
    private queue;
    private name;
    constructor(from: ConfigBuilder, name: string);
    compile_module(module: string): this;
    remove(path: string, recursive?: boolean): this;
    copy(from: string, to: string, overwrite?: boolean): this;
    pack(module: string): this;
    done(): ConfigBuilder;
}
export declare class ConfigBuilder {
    private modules;
    private loaders;
    private dependencies;
    private moduleType;
    private plugins;
    private queues;
    constructor();
    private current;
    add_module(name: string, paths: string[]): this;
    select_module(name: string): this;
    add_loader(path: string): this;
    use(name: string, ...parameters: Serializable[]): this;
    dependence(name: string): this;
    type(type: BuildType): this;
    create_build_queue(name?: string): QueueBuilder;
    set_queue(name: string, queue: Queue<QueueDataGroup>): void;
    build(): Config;
    write(filePath: string): void;
}
export declare const PLUGINS: {
    UTILS: {
        MINIFIER: "tsb.minifier";
        SHEBANG: "tsb.shebang";
        PACKER: "tsb.packer";
        NODE: {
            LOADER: "tsb.node.loader";
        };
    };
};
