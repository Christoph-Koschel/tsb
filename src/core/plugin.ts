import {Serializable} from "./config";
import {LibIncludeItem, ModuleItem} from "./types";
import {ClassDeclarationStructure, CodeBlockWriter} from "ts-morph";

export type PluginResultInformation = {
    outDir: string;
    outName: string;
    outPath: string;
    engineDir: string;
    module: string;
}

export abstract class Plugin {
    public abstract get name(): string;

    public abstract init(args: Serializable[]): void;

    public modify(module: ModuleItem): void {
    }

    public generate(): ClassDeclarationStructure[] {
        return [];
    }

    public beforeLoad(writer: CodeBlockWriter, information: PluginResultInformation): void {
        return;
    }

    public result(fileContent: string, information: PluginResultInformation): string | null {
        return null;
    }

    public sync(information: PluginResultInformation): void {
        return;
    }

    public pack(information: PluginResultInformation): LibIncludeItem[] | false {
        return false;
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