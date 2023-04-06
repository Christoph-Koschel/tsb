import {Serializable} from "../core/config";
import {ModuleItem} from "../core/types";
import {ClassDeclarationStructure} from "ts-morph";

export type PluginResultInformation = {
    outDir: string;
    outName: string;
    outPath: string;
}

export abstract class Plugin {
    public abstract get name(): string;

    public abstract init(args: Serializable[]): void;

    public modify(module: ModuleItem): void {

    }

    public generate(declaration: ClassDeclarationStructure): boolean {
        return false;
    }

    public result(fileContent: string, information: PluginResultInformation): string | null {
        return null;
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
}