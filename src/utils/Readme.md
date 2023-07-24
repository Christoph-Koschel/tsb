# Utils plugins

This folder contains some utils plugins of the tsb bundler

## tsb.minify

**Access name**: `PLUGINS.UTILS.MINIFIER`

By using this plugin, you can generate a minified version of your project

-----------------

## tsb.shebang

**Access name**: `PLUGINS.UTILS.SHEBANG`

You can use this plugin to add a shebang line at the beginning of your code

> This plugin should be loaded first, because it would not add the shebang line to the minified version when its loaded
> later.
----------------- 

## tsb.packer

**Access name**: `PLUGINS.UTILS.PACKER`

By using this plugin, you can add assets to the packing process

`builder.use(PLUGINS.UTILS.PACKER, <module>, ...<files|directories>)`

-----------------

## tsb.node.loader

**Access name**: `PLUGINS.UTILS.NODE.LOADER`

By using this plugin, you can load other files from a module file

`builder.use(PLUGINS.UTILS.PACKER, <module>, ...<js_files>)`

-----------------