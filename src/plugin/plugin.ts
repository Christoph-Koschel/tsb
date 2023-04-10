import {Serializable} from "../core/config";
import {ModuleItem} from "../core/types";
import {ClassDeclarationStructure, ModuleDeclarationStructure} from "ts-morph";

export type PluginResultInformation = {
    outDir: string;
    outName: string;
    outPath: string;
    engineDir: string;
}

export abstract class Plugin {
    public abstract get name(): string;

    public abstract init(args: Serializable[]): void;

    public modify(module: ModuleItem): void {

    }

    public generate(): ClassDeclarationStructure[] {
        return [];
    }

    public result(fileContent: string, information: PluginResultInformation): string | null {
        return null;
    }

    public sync(information: PluginResultInformation): void {
        return;
    }
}

export class PluginHandler {
    private static plugins: Map<string, Plugin> = new Map<string, Plugin>();

    public static register(plugin: Plugin): void {
        this.plugins.set(plugin.name, plugin);
    }

    public static instantiate(name: string, parameters: Serializable[]): Plugin | null {
        if (!this.plugins.has(name)) {
            return null;
        }

        // @ts-ignore
        const plugin: Plugin = new (<Plugin>this.plugins.get(name)).constructor();
        plugin.init(parameters);
        return plugin;
    }

    public static names(): string {
        let str: string[] = [];
        this.plugins.forEach(value => {
            str.push(value.name);
        });

        return str.join(", ") + this.plugins.size;
    }
}