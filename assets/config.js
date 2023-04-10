"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLUGINS = exports.ConfigBuilder = exports.QueueBuilder = exports.Serialization = exports.QueueKind = void 0;
const fs = require("fs");
const path = require("path");
var QueueKind;
(function (QueueKind) {
    QueueKind[QueueKind["COMPILE_MODULE"] = 0] = "COMPILE_MODULE";
    QueueKind[QueueKind["COPY"] = 1] = "COPY";
    QueueKind[QueueKind["REMOVE"] = 2] = "REMOVE";
    QueueKind[QueueKind["SYNC_PLUGIN"] = 3] = "SYNC_PLUGIN";
})(QueueKind = exports.QueueKind || (exports.QueueKind = {}));
class Serialization {
}
exports.Serialization = Serialization;
class QueueBuilder {
    from;
    queue;
    constructor(from) {
        this.from = from;
        this.queue = [];
    }
    compileModule(module) {
        this.queue.push({
            kind: QueueKind.COMPILE_MODULE,
            information: {
                moduleName: module
            }
        });
        return this;
    }
    remove(path, recursive = false) {
        this.queue.push({
            kind: QueueKind.REMOVE,
            information: {
                target: path,
                recursive: recursive
            }
        });
        return this;
    }
    copy(from, to, overwrite = false) {
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
    done() {
        this.from.setQueue(this.queue);
        return this.from;
    }
}
exports.QueueBuilder = QueueBuilder;
class ConfigBuilder {
    modules;
    loaders;
    plugins;
    queue;
    constructor() {
        this.modules = new Map();
        this.loaders = new Map();
        this.plugins = new Map();
        this.queue = false;
    }
    current = null;
    add_module(name, paths) {
        let convertedPaths = [];
        paths.forEach(value => {
            const loop = (root) => {
                fs.readdirSync(root).forEach(item => {
                    const itemPath = path.join(root, item);
                    if (fs.statSync(itemPath).isFile() && (itemPath.endsWith(".tsx") || itemPath.endsWith(".ts"))) {
                        convertedPaths.push(itemPath);
                    }
                    else if (fs.statSync(itemPath).isDirectory()) {
                        loop(itemPath);
                    }
                });
            };
            if (!fs.existsSync(value)) {
                console.log(`WARNING: The path '${value}' dont exist`);
                return;
            }
            if (fs.statSync(value).isFile()) {
                convertedPaths.push(value);
            }
            else if (fs.statSync(value).isDirectory()) {
                loop(value);
            }
        });
        this.modules.set(name, convertedPaths);
        this.loaders.set(name, []);
        this.plugins.set(name, []);
        this.current = name;
        return this;
    }
    select_module(name) {
        if (this.modules.has(name)) {
            this.current = name;
        }
        else {
            console.log(`ERROR: The module '${name}' dont exist`);
            process.exit(1);
        }
        return this;
    }
    add_loader(path) {
        if (!fs.existsSync(path)) {
            console.log(`WARNING: The path '${path}' dont exist`);
        }
        if (this.current == null) {
            console.log("ERROR: No module selected at 'add_loader'\nAt one with 'add_module' or select one with 'select_module'");
            process.exit(1);
        }
        if (!this.loaders.has(this.current)) {
            this.loaders.set(this.current, [path]);
        }
        else {
            this.loaders.get(this.current).push(path);
        }
        return this;
    }
    use(name, ...parameters) {
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
        }
        else {
            this.plugins.get(this.current).push({
                name: name,
                parameters: parameters
            });
        }
        return this;
    }
    createBuildQueue() {
        return new QueueBuilder(this);
    }
    setQueue(queue) {
        this.queue = queue;
    }
    build() {
        let modules = {};
        this.modules.forEach((value, key) => {
            modules[key] = value;
        });
        let loaders = {};
        this.loaders.forEach((value, key) => {
            loaders[key] = value;
        });
        let plugins = {};
        this.plugins.forEach((value, key) => {
            plugins[key] = value;
        });
        if (!this.queue) {
            this.queue = [];
            this.modules.forEach((value, key) => {
                this.queue.push({
                    kind: QueueKind.COMPILE_MODULE,
                    information: {
                        moduleName: key
                    }
                });
            });
        }
        return {
            queue: this.queue,
            modules: modules,
            loaders: loaders,
            plugins: plugins
        };
    }
    write(filePath) {
        const config = this.build();
        const plugins = {};
        for (let pluginKey in config.plugins) {
            plugins[pluginKey] = [];
            config.plugins[pluginKey].forEach(information => {
                const parameters = [];
                information.parameters.forEach(value => {
                    if (value instanceof Serialization) {
                        parameters.push(value.deserialize());
                    }
                    else {
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
            queue: config.queue,
            plugins: plugins
        }, null, 4));
    }
}
exports.ConfigBuilder = ConfigBuilder;
exports.PLUGINS = {
    UTILS: {
        MINIFIER: "tsb.minifier",
        SHEBANG: "tsb.shebang",
        TSX: "tsb.tsx"
    }
};
//# sourceMappingURL=config.js.map