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


export const R: {
    templates: {
        ts_config_json: ResourcesID
    },
    wrapper: {
        bundler_js: ResourcesID,
        res_ts: ResourcesID
    }
} = {
    templates: {
        ts_config_json: {
            id: 0
        }
    },
    wrapper: {
        bundler_js: {
            id: 1
        },
        res_ts: {
            id: 2
        }
    }
};

data.set(R.templates.ts_config_json.id, "ew0KICAiY29tcGlsZXJPcHRpb25zIjogew0KICAgICJ0YXJnZXQiOiAiZXMyMDIwIiwNCiAgICAibW9kdWxlIjogImVzMjAyMCIsDQogICAgIm1vZHVsZVJlc29sdXRpb24iOiAibm9kZSIsDQogICAgImRlY2xhcmF0aW9uIjogdHJ1ZSwNCiAgICAicmVtb3ZlQ29tbWVudHMiOiB0cnVlLA0KICAgICJvdXREaXIiOiAiYnVpbGQvc3JjIiwNCiAgICAiZGVjbGFyYXRpb25EaXIiOiAiYnVpbGQvaGVhZGVyIiwNCiAgICAicGF0aHMiOiB7DQogICAgICAiQHlhcG0vKiI6IFsiLi9saWIvKiJdDQogICAgfQ0KDQogIH0sDQogICJleGNsdWRlIjogWw0KICAgICJsaWIiLA0KICAgICJhc3NldHMiLA0KICAgICJub2RlX21vZHVsZXMiDQogIF0NCn0=");
data.set(R.wrapper.bundler_js.id, "InVzZSBzdHJpY3QiOw0KDQpjbGFzcyBUU0J1bmRsZXIgew0KICAgIGNvbnN0cnVjdG9yKCkgew0KICAgICAgICB0aGlzLmxvYWRlZCA9IG5ldyBNYXAoKTsNCiAgICAgICAgdGhpcy5tb2R1bGVzID0gbmV3IE1hcCgpOw0KICAgICAgICB0aGlzLmF1dG9sb2FkID0gW107DQogICAgfQ0KDQogICAgZGVmaW5lKG5hbWUsIGltcG9ydHMsIGNiKSB7DQogICAgICAgIHRoaXMubW9kdWxlcy5zZXQobmFtZSwgew0KICAgICAgICAgICAgaW1wb3J0czogaW1wb3J0cywNCiAgICAgICAgICAgIGNiOiBjYg0KICAgICAgICB9KTsNCiAgICB9DQoNCiAgICBsb2FkKG5hbWUpIHsNCiAgICAgICAgdGhpcy5hdXRvbG9hZC5wdXNoKG5hbWUpOw0KICAgIH0NCg0KICAgIGFzeW5jIHN0YXJ0KCkgew0KICAgICAgICBmb3IgKGNvbnN0IGxvYWQgb2YgdGhpcy5hdXRvbG9hZCkgew0KICAgICAgICAgICAgYXdhaXQgdGhpcy5sb2FkUGFja2FnZShsb2FkKTsNCiAgICAgICAgfQ0KICAgIH0NCg0KICAgIGFzeW5jIGxvYWRQYWNrYWdlKG5hbWUpIHsNCiAgICAgICAgaWYgKHRoaXMubW9kdWxlcy5oYXMobmFtZSkpIHsNCiAgICAgICAgICAgIGlmICh0aGlzLmxvYWRlZC5oYXMobmFtZSkpIHsNCiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkZWQuZ2V0KG5hbWUpOw0KICAgICAgICAgICAgfQ0KICAgICAgICAgICAgbGV0IG1vZCA9IHRoaXMubW9kdWxlcy5nZXQobmFtZSk7DQogICAgICAgICAgICBpZiAobW9kID09IHVuZGVmaW5lZCkgew0KICAgICAgICAgICAgICAgIHJldHVybiB7fTsNCiAgICAgICAgICAgIH0NCiAgICAgICAgICAgIGxldCBfX2ltcG9ydCA9IHt9Ow0KICAgICAgICAgICAgZm9yIChjb25zdCByZXEgb2YgbW9kLmltcG9ydHMpIHsNCiAgICAgICAgICAgICAgICBsZXQgcmVxSW1wb3J0ID0gYXdhaXQgdGhpcy5sb2FkUGFja2FnZShyZXEpOw0KICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlcUltcG9ydCkuZm9yRWFjaCgodmFsdWUpID0+IHsNCiAgICAgICAgICAgICAgICAgICAgX19pbXBvcnRbdmFsdWVdID0gcmVxSW1wb3J0W3ZhbHVlXTsNCiAgICAgICAgICAgICAgICB9KTsNCiAgICAgICAgICAgIH0NCiAgICAgICAgICAgIGxldCBfX2V4cG9ydCA9IHt9Ow0KICAgICAgICAgICAgYXdhaXQgbW9kLmNiKF9fZXhwb3J0LCBfX2ltcG9ydCk7DQogICAgICAgICAgICB0aGlzLmxvYWRlZC5zZXQobmFtZSwgX19leHBvcnQpOw0KICAgICAgICAgICAgcmV0dXJuIF9fZXhwb3J0Ow0KICAgICAgICB9IGVsc2Ugew0KICAgICAgICAgICAgdGhyb3cgIk5vIHBhY2thZ2Ugd2l0aCB0aGUgaWQgXCIiICsgbmFtZSArICJcIiBkZWZpbmVkIjsNCiAgICAgICAgfQ0KICAgIH0NCn0NCg0KY29uc3QgYnVuZGxlciA9IG5ldyBUU0J1bmRsZXIoKTsNCg==");
data.set(R.wrapper.res_ts.id, "dHlwZSBSZXNvdXJjZXNJRCA9IHsNCiAgICBpZDogbnVtYmVyOw0KfQ0KDQpjb25zdCBkYXRhOiBNYXA8bnVtYmVyLCBzdHJpbmc+ID0gbmV3IE1hcDxudW1iZXIsIHN0cmluZz4oKTsNCg0KZXhwb3J0IGZ1bmN0aW9uIGxvYWRfcmVzb3VyY2VzKGlkOiBSZXNvdXJjZXNJRCk6IHN0cmluZyB7DQogICAgaWYgKGRhdGEuaGFzKGlkLmlkKSkgew0KICAgICAgICByZXR1cm4gYXRvYig8c3RyaW5nPmRhdGEuZ2V0KGlkLmlkKSk7DQogICAgfQ0KICAgIHRocm93ICJSZXNvdXJjZXMgbm90IGRlY2xhcmVkIjsNCn0NCg0KZXhwb3J0IGZ1bmN0aW9uIGhhc19yZXNvdXJjZXMoaWQ6IFJlc291cmNlc0lEKTogYm9vbGVhbiB7DQogICAgcmV0dXJuIGRhdGEuaGFzKGlkLmlkKTsNCn0NCg0K");
