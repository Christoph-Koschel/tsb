type ResourcesID = {
    id: number;
}

const data: Map<number, string> = new Map<number, string>();

export function load_resources(id: ResourcesID): string {
    if (data.has(id.id)) {
        return atob(<string>data.get(id.id));
    }
    throw "Resources not declared";
}

export function has_resources(id: ResourcesID): boolean {
    return data.has(id.id);
}

