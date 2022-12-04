"use strict";

class TSBundler {
    constructor() {
        this.loaded = new Map();
        this.modules = new Map();
        this.autoload = [];
    }

    define(name, imports, cb) {
        this.modules.set(name, {
            imports: imports,
            cb: cb
        });
    }

    load(name) {
        this.autoload.push(name);
    }

    async start() {
        for (const load of this.autoload) {
            await this.loadPackage(load);
        }
    }

    async loadPackage(name) {
        if (this.modules.has(name)) {
            if (this.loaded.has(name)) {
                return this.loaded.get(name);
            }
            let mod = this.modules.get(name);
            if (mod == undefined) {
                return {};
            }
            let __import = {};
            for (const req of mod.imports) {
                let reqImport = await this.loadPackage(req);
                Object.keys(reqImport).forEach((value) => {
                    __import[value] = reqImport[value];
                });
            }
            let __export = {};
            await mod.cb(__export, __import);
            this.loaded.set(name, __export);
            return __export;
        } else {
            throw "No package with the id \"" + name + "\" defined";
        }
    }
}

const bundler = new TSBundler();
