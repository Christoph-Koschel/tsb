# Project structure

In this section, we will describe the project structure of TSB.

`assets`: The assets folder contains all the files required for the project build, such as files needed when
initializing a new project.

`src` : Obviously, this contains all the source modules of tsb ^^

`src/core` : This folder contains the fundamental code of TSB, and you should only modify its contents if you have a
deep
understanding of its inner workings.

# Mechanic of TSB

TSB's mechanic is actually very straightforward. The transpiler reads the config file and its automated or manual
building queue. When the queue gives a module to compile, it collects all the source files and compiles them normally
with the TypeScript API, converting the resulting AST into a single module with unique IDs wrapped in the TSB engine
function `Bundler.register`, and replacing imports and exports with the scoped objects `imports` and `exports` (don't
worry, all NodeJS modules can still be imported normally). The file is then analyzed, with interfaces and type-aliases
moved into a different scope separated by namespaces to prevent overwriting, before being sent to the plugins (see the
Plugins documentation for details). Finally, the AST is wrapped up and the result file is generated in the following
order: the TSB engine containing all the necessary structures for executing the TSB Runtime, all plugin's required
resources, the moved types in its interfaces, the actual module items, and the loader section where the modules will be
called, set by the `add_loader` function in the config file.

Although the transpilation process in TSB can be quite extensive, the ultimate goal of the tool is to provide a seamless
bundling experience without any unnecessary complexities, empowering developers to build fully-functional software using
just the source files and config file, and without any constraints.