# Plugin Development

> This WIKI Page is not finished, as it will require updates due to the planned plugin integration changes, ensuring it
> aligns with the latest standards.

Creating a plugin is a straightforward process. Once you've added the plugin to the config file, you'll need to program
its functionality. The structure of the plugin is completely up to you; feel free to use as many files as you need.
However, to keep things simple, we'll demonstrate how to create a basic plugin using just one file.

In this to-the-point tutorial, I will be demonstrating how to write a minifier plugin that utilizes
the [uglify-js](https://www.npmjs.com/package/uglify-js) package to minify the resulting content of TSB.

To start, we need to create the Plugin wrapper. This class acts as the connection point between TSB and your
modifications. A plugin class can be created with just a few lines of code, as shown below:

```typescript
import {Plugin, PluginHandler} from "../core/plugin";
import {Serializable} from "../core/config";

class MyPlugin extends Plugin {
    get name(): string {
        return "<MyUniqueVerficationName>";
    }

    init(args: Serializable[]): void {
    }

}

PluginHandler.register(new MyPlugin());
```

The `get name(): string` getter is used to identify your plugin, and this identifier must be utilized when adding your
plugin to the module using `ConfigBuilder.use`.

The `init` method is executed when a plugin is added to TSB. There's no need to worry about property overwriting, as TSB
will clone the object automatically when it's used.

> It's worth noting that the `init` method replaces the constructor of your class. As such, your constructor **can't**
> accept any kind of parameters.

The plugin code provided above doesn't do anything yet, so we'll need to make some changes.

------------------------

At this point, you have several options. You can override multiple methods:

```typescript
public
modify(module
:
ModuleItem
):
void
```

The `modify` method will be called after the interfaces and types have been separated from the files. You're free to
modify the AST according to your needs. However, it is no longer possible to add imports or exports.

> The imports and exports are intentionally limited to the user to ensure that they can keep track of the actual files
> and node modules being imported and exported, thus guaranteeing code safety.

```typescript
public
result(fileContent
:
string, information
:
PluginResultInformation
):
string | null
```

The `result` method will be called after all modules have been generated. At this point, you can edit the complete
produced code as needed. Just remember to return the modified code or null if no changes were made.

```typescript
public
generate(declaration
:
ClassDeclarationStructure
):
boolean
```

The `generate` method is used to implement any necessary resources in the output file. All resources are represented as
a class to prevent function overwriting.

```typescript
public
sync(information
:
PluginResultInformation
):
void
```

The `sync` method is used to complete a specific task when using the sync command

```typescript
public
pack(information
:
PluginResultInformation
):
LibIncludeItem[] | false
```

The `pack` method is utilized when a library is being prepared for packing. In cases where the plugin requires assets,
the method should return an array with their respective properties.

------------------------

Since we only want to modify the produced code, we'll override the `result` method.

```typescript
import * as ugly from "uglify-js";
import * as fs from "fs";
import * as path from "path";
import {Plugin, PluginHandler, PluginResultInformation} from "../plugin/plugin";
import {Serializable} from "../core/config";

class MyPlugin extends Plugin {
    get name(): string {
        return "<MyUniqueVerficationName>";
    }

    init(args: Serializable[]): void {
    }

    result(fileContent: string, information: PluginResultInformation): string | null {
        const outName: string = information.outName.replace(path.extname(information.outName), ".min.js");
        const minified: ugly.MinifyOutput = ugly.minify(fileContent, {
            sourceMap: false
        });

        fs.writeFileSync(path.join(information.outDir, outName), minified.code);
        return null;
    }
}

PluginHandler.register(new MyPlugin());
```

In this method, we obtain the output folder path and create a new path by copying it and changing the output extension
to `.min.js`. We then use the minify function from the [uglify-js](https://www.npmjs.com/package/uglify-js) package to
minify our code and write it to the filesystem using the `writeFileSync` function.

Since we don't want to replace the generated code, but rather produce a minified version of it, we return `null` to
indicate that no changes were made.

## Better plugin access

Finally, we can add our `<MyUniqueVerficationName>` to the PLUGINS object to make it easier to use.

Navigate to the [config.ts](/assets/config.ts) file in the assets folder. At the bottom of the file, you'll find an
object called `PLUGINS`.

```typescript
export const PLUGINS: {
    UTILS: {
        MINIFIER: "tsb.minifier",
        SHEBANG: "tsb.shebang"
    }
} = {
    UTILS: {
        MINIFIER: "tsb.minifier",
        SHEBANG: "tsb.shebang"
    }
}
```

To add your plugin, simply structure it within the `PLUGINS` object by creating a new object that includes the name of
your organization or any other identifier, and add the plugin name within it. For instance, consider the following
example:

```typescript
export const PLUGINS: {
    UTILS: {
        MINIFIER: "tsb.minifier",
        SHEBANG: "tsb.shebang"
    },
    MY_ORGANISATION: {
        MINIFIER: "<MyUniqueVerficationName>"
    }
} = {
    UTILS: {
        MINIFIER: "tsb.minifier",
        SHEBANG: "tsb.shebang"
    },
    MY_ORGANISATION: {
        MINIFIER: "<MyUniqueVerficationName>"
    }
}
```

You don't need to worry about typos, as you can simply use the name of your plugin from the config file. For example,
you can add your plugin like this:

```javascript
builder.use(PLUGINS.MY_ORGANISATION.MINIFIER);
```

If desired, you can use random characters as your `<MyUniqueVerificationName>`, as long as it remains unique.