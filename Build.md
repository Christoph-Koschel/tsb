# Costume Build

This is a step-by-step guide to compile a custom version of TSB. To get started, download the latest version of the TSB
source code.

# Project structure

In this section, we will describe the project structure of TSB.

`assets`: The assets folder contains all the files required for the project build, such as files needed when
initializing a new project.

`src` : Obviously, this contains all the source modules of tsb ^^

`src/core` : This folder contains the fundamental code of TSB, and you should only modify its contents if you have a
deep
understanding of its inner workings.

`src/plugin` : The plugin folder in TSB contains all the necessary files to create and use custom plugins, which can
enhance the functionality and capabilities of the transpiler to suit specific project requirements.

# Mechanic of TSB

TSB's mechanic is actually very straightforward. The transpiler reads the config file and its automated or manual
building queue. When the queue gives a module to compile, it collects all the source files and compiles them normally
with the
TypeScript API, converting the resulting AST into a single module with unique IDs wrapped in the TSB engine function
`Bundler.register`, and replacing imports and exports with the scoped objects `imports` and `exports` (don't worry, all
NodeJS
modules can still be imported normally). The file is then analyzed, with interfaces and type-aliases moved into a
different scope separated by namespaces to prevent overwriting, before being sent to the plugins (see the Plugins
documentation for details). Finally, the AST is wrapped up and the result file is generated in the following order: the
TSB engine containing all the necessary structures for executing the TSB Runtime, all plugin's required resources, the
moved types in its interfaces, the actual module items, and the loader section where the modules will be called, set by
the `add_loader` function in the config file.

Although the transpilation process in TSB can be quite extensive, the ultimate goal of the tool is to provide a seamless
bundling experience without any unnecessary complexities, empowering developers to build fully-functional software using
just the source files and config file, and without any constraints.

# Remove a plugin

If you want to remove a plugin from your TSB build, you don't need to delete the source code. Instead, simply remove the
plugin's folder you don't want to compile from the module configuration in the [tsb.config.js](/tsb.config.js) file.

```javascript
builder.add_module("tsb", [
//    "./src/<my plugin>",                                      <-- Plugin to remove
    "./src/core"
])
    //    .add_loader("./src/core/<my plugin>/<my loader>")     <-- Loader of the plugin to remove
    .add_loader("./src/core/bin/tsb.ts");
```

> **Important note:** Do not remove the core module, as it is essential for the proper functioning of TSB.

# Add a plugin

To add your plugin to TSB, create a new folder in the `src` folder and add your code. Then, add the path to the source
paths of the tsb module. Additionally, make sure to add your loader to the loader path using the `add_loader` function.

```javascript
builder.add_module("tsb", [
    "./src/<my plugin>",
    "./src/core"
])
    .add_loader("./src/core/<my plugin>/<my loader>")
    .add_loader("./src/core/bin/tsb.ts");
```

# Emit changes

To emit your changes and build the updated software, run the following command:

```shell
./build.sh
```

When you run the build command, the project will go through several processes. Firstly, the complete source code will be
parsed with the normal TypeScript compiler. Then, the source code will be parsed again to produce the TSB bundler in the
out folder. Finally, the source code will be parsed once more to verify that everything went smoothly with the resulting
file in the out folder. Additionally, some cleanup tasks will be performed, such as removing all .js and .js.map files
in the src folder. Note that the build.sh script will run the build task multiple times, so don't be alarmed.

# Plugin Structure

Creating a plugin is a straightforward process. Once you've added the plugin to the config file, you'll need to program
its functionality. The structure of the plugin is completely up to you; feel free to use as many files as you need.
However, to keep things simple, we'll demonstrate how to create a basic plugin using just one file.

In this to-the-point tutorial, I will be demonstrating how to write a minifier plugin that utilizes
the [uglify-js](https://www.npmjs.com/package/uglify-js) package to minify the resulting content of TSB.

To start, we need to create the Plugin wrapper. This class acts as the connection point between TSB and your
modifications. A plugin class can be created with just a few lines of code, as shown below:

```typescript
import {Plugin, PluginHandler} from "../plugin/plugin";
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

The `init` method is executed when a plugin is added to TSB. There's no need to worry about file overwriting, as TSB
will clone the object automatically when it's used.

> It's worth noting that the `init` method replaces the constructor of your class. As such, your constructor **can't**
> accept any kind of parameters.

The plugin code provided above doesn't do anything yet, so we'll need to make some changes.

------------------------

At this point, you have several options. You can override multiple methods:

```
public modify(module: ModuleItem): void
```

The `modify` method will be called after the interfaces and types have been separated from the files. You're free to
modify the AST according to your needs, which includes the ability to add or remove imports as necessary.

```
public result(fileContent: string, information: PluginResultInformation): string | null
```

The `result` method will be called after all modules have been generated. At this point, you can edit the complete
produced code as needed. Just remember to return the modified code or null if no changes were made.

```
public generate(declaration: ClassDeclarationStructure): boolean
```

The `generate` method is used to implement any necessary resources in the output file. All resources are represented as
a class to prevent function overwriting.

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

If you want, you can use random characters as your `<MyUniqueVerificationName>`.