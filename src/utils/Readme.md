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

## tsb.tsx

**Access name**: `PLUGIN.UTILS.TSX`

This plugin will convert all tsx files into a JavaScript-friendly format

> This extension optionally provides header files for your IDE. So don't forget to run the `sync` command when you add
> the plugin.