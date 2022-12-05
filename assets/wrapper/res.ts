import {atob} from "buffer";

type ResourcesID = {
    id: number;
}

const data: Map<number, string> = new Map<number, string>();

function decode(data: string): string {
    if (typeof atob == "undefined") {
        if (typeof Buffer == "undefined") {
            throw "Cannot decode resources no atop and no Buffer class declared";
        } else {
            return Buffer.from(data, "base64").toString("utf-8");
        }
    } else {
        return atob(data);
    }
}

export function load_resources(id: ResourcesID): string {
    if (data.has(id.id)) {
        return decode(<string>data.get(id.id));
    }
    throw "Resources not declared";
}

export function has_resources(id: ResourcesID): boolean {
    return data.has(id.id);
}

