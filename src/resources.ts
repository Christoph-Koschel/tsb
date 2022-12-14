import {atob} from "buffer";

type ResourcesID = {
    id: number;
}

const data: Map<number, string> = new Map<number, string>();

function decode(data: string): string {
    if (typeof atob == "undefined") {
        // @ts-ignore
        if (typeof Buffer == "undefined") {
            throw "Cannot decode resources no atop and no Buffer class declared";
        } else {
            // @ts-ignore
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


export const R: {
    git: {
        gitignore_txt: ResourcesID,
        release_yml: ResourcesID
    },
    npm: {
        package_json: ResourcesID
    },
    templates: {
        ts_config_json: ResourcesID
    },
    wrapper: {
        bundler_js: ResourcesID,
        res_ts: ResourcesID
    }
} = {
    git: {
        gitignore_txt: {
            id: 0
        },
        release_yml: {
            id: 1
        }
    },
    npm: {
        package_json: {
            id: 2
        }
    },
    templates: {
        ts_config_json: {
            id: 3
        }
    },
    wrapper: {
        bundler_js: {
            id: 4
        },
        res_ts: {
            id: 5
        }
    }
};

data.set(R.git.gitignore_txt.id, "bGliDQpub2RlX21vZHVsZXMNCmJ1aWxkDQo=");
data.set(R.git.release_yml.id, "bmFtZTogUmVsZWFzZQ0KDQpvbjoNCiAgcHVzaDoNCiAgICB0YWdzOg0KICAgICAgLSAiKiINCg0Kam9iczoNCiAgYnVpbGQ6DQogICAgbmFtZTogQnVpbGQNCiAgICBydW5zLW9uOiB3aW5kb3dzLWxhdGVzdA0KICAgIHN0ZXBzOg0KICAgICAgLSB1c2VzOiBhY3Rpb25zL2NoZWNrb3V0QHYzDQoNCiAgICAgIC0gbmFtZTogQ3JlYXRlIHJlbGVhc2UgcGFja2FnZQ0KICAgICAgICB1c2VzOiBhY3Rpb25zL3NldHVwLW5vZGVAdjMNCiAgICAgICAgd2l0aDoNCiAgICAgICAgICBub2RlX3ZlcnNpb246IDE2LngNCiAgICAgIC0gcnVuOiBucG0gaW5zdGFsbCAtLWdsb2JhbCB0eXBlc2NyaXB0DQogICAgICAtIHJ1bjogbnBtIGluc3RhbGwgLS1nbG9iYWwgaHR0cHM6Ly9naXRodWIuY29tL0NocmlzdG9waC1Lb3NjaGVsL3RzYi5naXQNCiAgICAgIC0gcnVuOiBucG0gaW5zdGFsbCAtLWdsb2JhbCBodHRwczovL2dpdGh1Yi5jb20vQ2hyaXN0b3BoLUtvc2NoZWwveWFwbS1jbGkuZ2l0DQogICAgICAtIHJ1bjogaWYgKFRlc3QtUGF0aCAuL3BhY2thZ2UuanNvbikgeyBucG0gaW5zdGFsbCB9DQogICAgICAtIHJ1bjogeWFwbSBpbnN0YWxsDQogICAgICAtIHJ1bjogdHNiIGNvbXBpbGUgLS1saWIgLS1taW5pZnkNCg0KICAgICAgLSBuYW1lOiBDcmVhdGUgR2l0SHViIFJlbGVhc2UNCiAgICAgICAgaWQ6IGNyZWF0ZS1yZWxlYXNlDQogICAgICAgIHVzZXM6IGFjdGlvbnMvY3JlYXRlLXJlbGVhc2VAdjENCiAgICAgICAgZW52Og0KICAgICAgICAgIEdJVEhVQl9UT0tFTjogJHt7IHNlY3JldHMuR0lUSFVCX1RPS0VOIH19DQogICAgICAgIHdpdGg6DQogICAgICAgICAgdGFnX25hbWU6ICR7eyBnaXRodWIucmVmIH19DQogICAgICAgICAgcmVsZWFzZV9uYW1lOiAke3sgZ2l0aHViLnJlZiB9fQ0KICAgICAgLSBuYW1lOiBVcGxvYWQgcmVsZWFzZSBhc3NldHMNCiAgICAgICAgdXNlczogYWN0aW9ucy91cGxvYWQtcmVsZWFzZS1hc3NldEB2MQ0KICAgICAgICBlbnY6DQogICAgICAgICAgR0lUSFVCX1RPS0VOOiAke3sgc2VjcmV0cy5HSVRIVUJfVE9LRU4gfX0NCiAgICAgICAgd2l0aDoNCiAgICAgICAgICB1cGxvYWRfdXJsOiAke3sgc3RlcHMuY3JlYXRlLXJlbGVhc2Uub3V0cHV0cy51cGxvYWRfdXJsIH19DQogICAgICAgICAgYXNzZXRfcGF0aDogLi8ke3sgZ2l0aHViLmV2ZW50LnJlcG9zaXRvcnkubmFtZSB9fS0ke3sgZ2l0aHViLnJlZl9uYW1lIH19LnlhcG0uemlwDQogICAgICAgICAgYXNzZXRfbmFtZTogJHt7IGdpdGh1Yi5ldmVudC5yZXBvc2l0b3J5Lm5hbWUgfX0tJHt7IGdpdGh1Yi5yZWZfbmFtZSB9fS55YXBtLnppcA0KICAgICAgICAgIGFzc2V0X2NvbnRlbnRfdHlwZTogYXBwbGljYXRpb24vemlw");
data.set(R.npm.package_json.id, "ew0KICAibmFtZSI6ICIlcyIsDQogICJhdXRob3IiOiAiJXMiLA0KICAibGljZW5zZSI6ICIlcyIsDQogICJ2ZXJzaW9uIjogIiVzIiwNCiAgImRlc2NyaXB0aW9uIjogIiIsDQogICJkZXBlbmRlbmNpZXMiOiB7fQ0KfQ==");
data.set(R.templates.ts_config_json.id, "ew0KICAiY29tcGlsZXJPcHRpb25zIjogew0KICAgICJ0YXJnZXQiOiAiZXMyMDIwIiwNCiAgICAibW9kdWxlIjogImVzMjAyMCIsDQogICAgIm1vZHVsZVJlc29sdXRpb24iOiAibm9kZSIsDQogICAgImRlY2xhcmF0aW9uIjogdHJ1ZSwNCiAgICAicmVtb3ZlQ29tbWVudHMiOiB0cnVlLA0KICAgICJvdXREaXIiOiAiYnVpbGQvc3JjIiwNCiAgICAiZGVjbGFyYXRpb25EaXIiOiAiYnVpbGQvaGVhZGVyIiwNCiAgICAicGF0aHMiOiB7DQogICAgICAiQHlhcG0vKiI6IFsiLi9saWIvKiJdDQogICAgfQ0KDQogIH0sDQogICJleGNsdWRlIjogWw0KICAgICJsaWIiLA0KICAgICJhc3NldHMiLA0KICAgICJub2RlX21vZHVsZXMiDQogIF0NCn0=");
data.set(R.wrapper.bundler_js.id, "InVzZSBzdHJpY3QiOw0KDQpjbGFzcyBUU0J1bmRsZXIgew0KICAgIGNvbnN0cnVjdG9yKCkgew0KICAgICAgICB0aGlzLmxvYWRlZCA9IG5ldyBNYXAoKTsNCiAgICAgICAgdGhpcy5tb2R1bGVzID0gbmV3IE1hcCgpOw0KICAgICAgICB0aGlzLmF1dG9sb2FkID0gW107DQogICAgfQ0KDQogICAgZGVmaW5lKG5hbWUsIGltcG9ydHMsIGNiKSB7DQogICAgICAgIHRoaXMubW9kdWxlcy5zZXQobmFtZSwgew0KICAgICAgICAgICAgaW1wb3J0czogaW1wb3J0cywNCiAgICAgICAgICAgIGNiOiBjYg0KICAgICAgICB9KTsNCiAgICB9DQoNCiAgICBsb2FkKG5hbWUpIHsNCiAgICAgICAgdGhpcy5hdXRvbG9hZC5wdXNoKG5hbWUpOw0KICAgIH0NCg0KICAgIGFzeW5jIHN0YXJ0KCkgew0KICAgICAgICBmb3IgKGNvbnN0IGxvYWQgb2YgdGhpcy5hdXRvbG9hZCkgew0KICAgICAgICAgICAgYXdhaXQgdGhpcy5sb2FkUGFja2FnZShsb2FkKTsNCiAgICAgICAgfQ0KICAgIH0NCg0KICAgIGFzeW5jIGxvYWRQYWNrYWdlKG5hbWUpIHsNCiAgICAgICAgaWYgKHRoaXMubW9kdWxlcy5oYXMobmFtZSkpIHsNCiAgICAgICAgICAgIGlmICh0aGlzLmxvYWRlZC5oYXMobmFtZSkpIHsNCiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkZWQuZ2V0KG5hbWUpOw0KICAgICAgICAgICAgfQ0KICAgICAgICAgICAgbGV0IG1vZCA9IHRoaXMubW9kdWxlcy5nZXQobmFtZSk7DQogICAgICAgICAgICBpZiAobW9kID09IHVuZGVmaW5lZCkgew0KICAgICAgICAgICAgICAgIHJldHVybiB7fTsNCiAgICAgICAgICAgIH0NCiAgICAgICAgICAgIGxldCBfX2ltcG9ydCA9IHt9Ow0KICAgICAgICAgICAgZm9yIChjb25zdCByZXEgb2YgbW9kLmltcG9ydHMpIHsNCiAgICAgICAgICAgICAgICBsZXQgcmVxSW1wb3J0ID0gYXdhaXQgdGhpcy5sb2FkUGFja2FnZShyZXEpOw0KICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlcUltcG9ydCkuZm9yRWFjaCgodmFsdWUpID0+IHsNCiAgICAgICAgICAgICAgICAgICAgX19pbXBvcnRbdmFsdWVdID0gcmVxSW1wb3J0W3ZhbHVlXTsNCiAgICAgICAgICAgICAgICB9KTsNCiAgICAgICAgICAgIH0NCiAgICAgICAgICAgIGxldCBfX2V4cG9ydCA9IHt9Ow0KICAgICAgICAgICAgYXdhaXQgbW9kLmNiKF9fZXhwb3J0LCBfX2ltcG9ydCk7DQogICAgICAgICAgICB0aGlzLmxvYWRlZC5zZXQobmFtZSwgX19leHBvcnQpOw0KICAgICAgICAgICAgcmV0dXJuIF9fZXhwb3J0Ow0KICAgICAgICB9IGVsc2Ugew0KICAgICAgICAgICAgdGhyb3cgIk5vIHBhY2thZ2Ugd2l0aCB0aGUgaWQgXCIiICsgbmFtZSArICJcIiBkZWZpbmVkIjsNCiAgICAgICAgfQ0KICAgIH0NCn0NCg0KY29uc3QgYnVuZGxlciA9IG5ldyBUU0J1bmRsZXIoKTsNCg==");
data.set(R.wrapper.res_ts.id, "dHlwZSBSZXNvdXJjZXNJRCA9IHsNCiAgICBpZDogbnVtYmVyOw0KfQ0KDQpjb25zdCBkYXRhOiBNYXA8bnVtYmVyLCBzdHJpbmc+ID0gbmV3IE1hcDxudW1iZXIsIHN0cmluZz4oKTsNCg0KZnVuY3Rpb24gZGVjb2RlKGRhdGE6IHN0cmluZyk6IHN0cmluZyB7DQogICAgaWYgKHR5cGVvZiBhdG9iID09ICJ1bmRlZmluZWQiKSB7DQogICAgICAgIC8vIEB0cy1pZ25vcmUNCiAgICAgICAgaWYgKHR5cGVvZiBCdWZmZXIgPT0gInVuZGVmaW5lZCIpIHsNCiAgICAgICAgICAgIHRocm93ICJDYW5ub3QgZGVjb2RlIHJlc291cmNlcyBubyBhdG9wIGFuZCBubyBCdWZmZXIgY2xhc3MgZGVjbGFyZWQiOw0KICAgICAgICB9IGVsc2Ugew0KICAgICAgICAgICAgLy8gQHRzLWlnbm9yZQ0KICAgICAgICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGRhdGEsICJiYXNlNjQiKS50b1N0cmluZygidXRmLTgiKTsNCiAgICAgICAgfQ0KICAgIH0gZWxzZSB7DQogICAgICAgIHJldHVybiBhdG9iKGRhdGEpOw0KICAgIH0NCn0NCg0KZXhwb3J0IGZ1bmN0aW9uIGxvYWRfcmVzb3VyY2VzKGlkOiBSZXNvdXJjZXNJRCk6IHN0cmluZyB7DQogICAgaWYgKGRhdGEuaGFzKGlkLmlkKSkgew0KICAgICAgICByZXR1cm4gZGVjb2RlKDxzdHJpbmc+ZGF0YS5nZXQoaWQuaWQpKTsNCiAgICB9DQogICAgdGhyb3cgIlJlc291cmNlcyBub3QgZGVjbGFyZWQiOw0KfQ0KDQpleHBvcnQgZnVuY3Rpb24gaGFzX3Jlc291cmNlcyhpZDogUmVzb3VyY2VzSUQpOiBib29sZWFuIHsNCiAgICByZXR1cm4gZGF0YS5oYXMoaWQuaWQpOw0KfQ0KDQo=");
