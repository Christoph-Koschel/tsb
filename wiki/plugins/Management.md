# Plugin Management

## Disable a plugin

If you want to remove a plugin from your TSB build, you don't need to delete the source code; instead, simply comment
out the place where the plugin is registered to the `PluginHandler`, for example, in the utils.

```typescript
PluginHandler.register(new Minifier());
// PluginHandler.register(new Shebang());
PluginHandler.register(new NodeJSLoader());
PluginHandler.register(new Packer());
```

## Disable a collection

If you want to remove multiple plugins, for example, those of an organization, it can be easily accomplished by removing
the module instances of the NodeJS loader of the tsb module in the config file. However, it is important never to remove
any plugin dependencies from other modules as it could lead to build failures. Keep this in mind during the process of
removing plugin extensions.

```javascript
// file: tsb.config.js
builder.add_module("tsb",
    [
        "./src/core"
    ]
)
    .add_loader("./src/core/bin/tsb.ts")
    .use(PLUGINS.UTILS.NODE.LOADER, "tsb", "./utils.min.js" /*, "./myPlugin.min.js" */)
    .use(PLUGINS.UTILS.SHEBANG)
    .use(PLUGINS.UTILS.MINIFIER);
```

## Plugin Management through CLI [WIP]

In a future update, it is planned that plugins will be added and removed directly through TSB CLI commands, and plugin
development will be facilitated via a dedicated TSB Template, simplifying the process, and requiring only packaging
through the CLI for project integration.

> This is a planned feature it's not implemented in the current version