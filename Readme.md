# TSB

TSB (TypeScript Bundler) is a software tool that provides a complete solution for building and
running TypeScript applications. It combines a bundler and runtime system into a single package, making it easy to
manage the entire application development lifecycle.

TSB is a powerful and flexible tool for building and running TypeScript
applications, and it comes with a range of features that make it easy to manage your development workflow. Some of the
key features of TSB include:

- Runtime config management: TSB allows you to manage your application configuration at runtime. You can choose to load
  your modules once into cache or reload it every time it's imported.

- Runtime loading of other compiled files: TSB allows you to load other compiled files at runtime, making it easy to
  manage dependencies and keep your application up-to-date. [WIP]

- Extensible through plugins: TSB is highly extensible and can be customized with plugins to fit your specific needs.
  You can add new features, modify existing ones, and integrate with other tools and frameworks.

- Costume Preprocessor: Macro implementation and preprocessor directives are planned. [WIP]

- TSB supports exporting symbols globally, making them accessible to other frameworks, scripts, and similar components,
  even when isolated from the global scope. [WIP]

Overall, TSB is a powerful and flexible tool for building and running TypeScript applications, and it can be a great
choice for developers who want a complete solution for managing their application development workflow.

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine for development and testing purposes. See deployment
for notes on deploying the project on a live system.

### Prerequisites

Requirements for the software and other tools to build, test and push

- [NodeJS](https://nodejs.org/en)

### Installing

Just run the following command to install tsb globally on your local machine

```shell
npm install -g https://github.com/Christoph-Koschel/tsb
```

> NPM Package will follow soon.

## Wiki

Feel free to explore the wiki, accessible either through the wiki folder or the wiki tab. Your contributions and
insights are warmly encouraged and appreciated

## Authors

- **[Christoph Koschel](https://github.com/Christoph-Koschel)**

  &#45; *Programmer of the core system of TSB*

  &#45; *Programmer of the utils plugins*

## License

This project is licensed under the [GNU General Public License](LICENSE)