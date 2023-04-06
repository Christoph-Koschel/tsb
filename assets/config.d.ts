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
    plugins: {
        [Name in string]: PluginInformation[];
    };
    queue: Queue<QueueDataGroup>;
};
export declare type PluginInformation = {
    name: string;
    parameters: Serializable[];
};
export declare enum QueueKind {
    COMPILE_MODULE = 0,
    COPY = 1,
    REMOVE = 2
}
export declare type QueueDataGroup = CopyData | RemoveData | CompileModuleData;
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
export declare type Queue<T> = QueueEntry<T>[];
export declare type QueueEntry<T> = {
    kind: QueueKind;
    information: T;
};
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
    constructor(from: ConfigBuilder);
    compileModule(module: string): this;
    remove(path: string, recursive?: boolean): this;
    copy(from: string, to: string, overwrite?: boolean): this;
    done(): ConfigBuilder;
}
export declare class ConfigBuilder {
    private modules;
    private loaders;
    private plugins;
    private queue;
    constructor();
    private current;
    add_module(name: string, paths: string[]): this;
    select_module(name: string): this;
    add_loader(path: string): this;
    use(name: string, ...parameters: Serializable[]): this;
    createBuildQueue(): QueueBuilder;
    setQueue(queue: Queue<QueueDataGroup>): void;
    build(): Config;
    write(filePath: string): void;
}
//# sourceMappingURL=config.d.ts.map