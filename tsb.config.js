const {ConfigBuilder, PLUGINS} = require("./assets/config");

let builder = new ConfigBuilder();

builder.add_module("tsb", ["./src/utils", "./src/plugin", "./src/core"])
    .add_loader("./src/utils/utils.ts")
    .add_loader("./src/core/bin/tsb.ts")
    .use(PLUGINS.UTILS.SHEBANG)
    .use(PLUGINS.UTILS.MINIFIER);

// ----------------------------------
// DON'T MODIFY THIS SECTION BELOW
builder.create_build_queue("core")
    .compile_module("tsb")
    .done();

builder.create_build_queue("all")
    .copy("./assets/config.ts", "./src/core", true)
    .compile_module("tsb")
    .copy("./package.json", "./out", true)
    .copy("./package-lock.json", "./out", true)
    .copy("./node_modules", "./out", true)
    .copy("./assets", "./out", true)
    .remove("./out/assets/config.ts")
    .remove("./out/assets/config.js.map")
    .remove("./out/assets/config.d.ts.map")
    .done()

builder.create_build_queue("fast")
    .copy("./assets/config.ts", "./src/core", true)
    .compile_module("tsb")
    .copy("./package.json", "./out", true)
    .copy("./package-lock.json", "./out", true)
    .copy("./assets", "./out", true)
    .remove("./out/assets/config.ts")
    .remove("./out/assets/config.js.map")
    .remove("./out/assets/config.d.ts.map")
    .done()

builder.write("./tsb.config.json");
exports.default = builder.build();