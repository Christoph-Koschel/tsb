const {ConfigBuilder} = require("./config/config");
let builder = new ConfigBuilder();

// YOUR CONFIG

exports.default = builder.build();