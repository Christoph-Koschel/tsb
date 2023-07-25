const {ConfigBuilder} = require("./engine/config");
const {PLUGINS} = require("./engine/plugins");
let builder = new ConfigBuilder();

const PLUGIN_NAME = "myplugin";    // <--- Set your plugin name
const SRC_DIRECTORIES = [];        // <--- Set your src roots
const LOADERS = [];                // <--- Set your loader files

// ----------------------------------
// DON'T MODIFY THIS SECTION BELOW

const PLUGIN_MODIFIED_NAME = PLUGIN_NAME.replace(/\./gi, "_");
const PLUGINS_RELEASE_DIR = "<@OUTPUT@>";

builder.add_module(PLUGIN_MODIFIED_NAME, SRC_DIRECTORIES)
    .type("lib")
    .use(PLUGINS.TSB.MINIFIER);

LOADERS.forEach((loader) => {
    builder.add_loader(loader);
});

builder.create_build_queue("build")
    .compile_module(PLUGIN_MODIFIED_NAME)
    .pack(PLUGIN_MODIFIED_NAME)
    .done();

builder.create_build_queue("test")
    .compile_module(PLUGIN_MODIFIED_NAME)
    .pack(PLUGIN_MODIFIED_NAME)
    .copy(`./out/${PLUGIN_MODIFIED_NAME}.min.js`, PLUGINS_RELEASE_DIR, true);

exports.default = builder.build();