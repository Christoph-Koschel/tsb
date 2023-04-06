# Utils plugins

This folder contains some utils plugins of the tsb bundler

## tsb.minify

**Access name**: PLUGINS.UTILS.MINIFIER

Use this plugin to generate a minified version of your project.

-----------------

## tsb.shebang

**Access name**: PLUGINS.UTILS.SHEBANG

Use this plugin to append a shebang line at the beginning of your code

> This plugin should be loaded first, because it would not add the shebang line to the minified version when its loaded
> later.

