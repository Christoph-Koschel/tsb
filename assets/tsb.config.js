const {ConfigBuilder} = require("./engine/config");
let builder = new ConfigBuilder();

// YOUR CONFIG

exports.default = builder.build();