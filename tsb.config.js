const {ConfigBuilder, PLUGINS} = require("./assets/config");

let builder = new ConfigBuilder();

builder.add_module("tsb", [
    "./src/utils",
    "./src/plugin",
    "./src/core"
])
    .add_loader("./src/utils/utils.ts")
    .add_loader("./src/core/bin/tsb.ts");

builder.use(PLUGINS.UTILS.SHEBANG);
builder.use(PLUGINS.UTILS.MINIFIER);

// DON'T MODIFY THIS SECTION
builder.createBuildQueue()
    .copy("./assets/config.ts", "./src/core", true)
    .compileModule("tsb")
    .copy("./package.json", "./out", true)
    .copy("./package-lock.json", "./out", true)
    // .copy("./node_modules", "./out", true) TODO temporally removed
    .copy("./assets", "./out", true)
    .remove("./out/assets/config.ts")
    .remove("./out/assets/config.js.map")
    .remove("./out/assets/config.d.ts.map")
    .done();

builder.write("./tsb.config.json");
exports.default = builder.build();