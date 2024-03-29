const {ConfigBuilder} = require("./assets/config");
const {PLUGINS} = require("./assets/plugins");

let builder = new ConfigBuilder();

builder.add_module("standalone", [
    "./src/utils",
    "./src/core"
])
    .add_loader("./src/utils/utils.ts")
    .add_loader("./src/core/bin/tsb.ts")
    .use(PLUGINS.TSB.SHEBANG)
    .use(PLUGINS.TSB.MINIFIER);

builder.add_module("tsb",
    [
        "./src/core"
    ]
)
    .add_loader("./src/core/bin/tsb.ts")
    .use(PLUGINS.TSB.SHEBANG)
    .use(PLUGINS.TSB.MINIFIER);

// Set lib type dynamically to increase build efficiency
if (process.argv.length >= 4 && process.argv[3] === "plugin") {
    builder.type("lib");
}


builder.add_module("utils", [
    "./src/utils"
])
    .dependence("tsb")
    .add_loader("./src/utils/utils.ts")
    .use(PLUGINS.TSB.MINIFIER);

// ----------------------------------
// DON'T MODIFY THIS SECTION BELOW
builder.create_build_queue("core")
    .compile_module("utils")
    .compile_module("tsb")
    .copy("./out/utils.min.js", "./out/plugins", true)
    .done();

builder.create_build_queue("all")
    .copy("./assets/config.ts", "./src/core", true)
    .compile_module("utils")
    .compile_module("tsb")
    .copy("./package.json", "./out", true)
    .copy("./package-lock.json", "./out", true)
    .copy("./node_modules", "./out", false)
    // ---------- ASSETS ----------
    .copy("./assets/config.js", "./out/assets", true)
    .copy("./assets/config.d.ts", "./out/assets", true)
    .copy("./assets/engine.d.ts", "./out/assets", true)
    .copy("./assets/tsb.config.js", "./out/assets", true)
    .copy("./assets/plugin.config.js", "./out/assets", true)
    .copy("./assets/tsb.lib.zip", "./out/assets", true)
    // ----------------------------
    .copy("./out/utils.min.js", "./out/plugins", true)
    .done();

builder.create_build_queue("fast")
    .copy("./assets/config.ts", "./src/core", true)
    .compile_module("utils")
    .compile_module("tsb")
    .copy("./package.json", "./out", true)
    .copy("./package-lock.json", "./out", true)
    // ---------- ASSETS ----------
    .copy("./assets/config.js", "./out/assets", true)
    .copy("./assets/config.d.ts", "./out/assets", true)
    .copy("./assets/engine.d.ts", "./out/assets", true)
    .copy("./assets/tsb.config.js", "./out/assets", true)
    .copy("./assets/plugin.config.js", "./out/assets", true)
    .copy("./assets/tsb.lib.zip", "./out/assets", true)
    // ----------------------------
    .copy("./out/utils.min.js", "./out/plugins", true)
    .done();

builder.create_build_queue("standalone")
    .copy("./assets/config.ts", "./src/core", true)
    .compile_module("standalone")
    .copy("./package.json", "./out", true)
    .copy("./package-lock.json", "./out", true)
    .copy("./node_modules", "./out", false)
    // ---------- ASSETS ----------
    .copy("./assets/config.js", "./out/assets", true)
    .copy("./assets/config.d.ts", "./out/assets", true)
    .copy("./assets/engine.d.ts", "./out/assets", true)
    .copy("./assets/tsb.config.js", "./out/assets", true)
    .copy("./assets/plugin.config.js", "./out/assets", true)
    .copy("./assets/tsb.lib.zip", "./out/assets", true)
    // ----------------------------
    .copy("./out/utils.min.js", "./out/plugins", true)
    .done();

builder.create_build_queue("plugin")
    .compile_module("tsb")
    .pack("tsb")
    .copy("./tsb.lib.zip", "./assets/", true)
    .remove("./tsb.lib.zip")
    // ---------- ASSETS ----------
    .copy("./assets/tsb.lib.zip", "./out/assets", true)
    // ----------------------------
    .done();

builder.write("./tsb.config.json");
exports.default = builder.build();
