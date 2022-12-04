#!/usr/bin/env node
"use strict";

class TSBundler {
    constructor() {
        this.loaded = new Map();
        this.modules = new Map();
        this.autoload = [];
    }

    define(name, imports, cb) {
        this.modules.set(name, {
            imports: imports,
            cb: cb
        });
    }

    load(name) {
        this.autoload.push(name);
    }

    async start() {
        for (const load of this.autoload) {
            await this.loadPackage(load);
        }
    }

    async loadPackage(name) {
        if (this.modules.has(name)) {
            if (this.loaded.has(name)) {
                return this.loaded.get(name);
            }
            let mod = this.modules.get(name);
            if (mod == undefined) {
                return {};
            }
            let __import = {};
            for (const req of mod.imports) {
                let reqImport = await this.loadPackage(req);
                Object.keys(reqImport).forEach((value) => {
                    __import[value] = reqImport[value];
                });
            }
            let __export = {};
            await mod.cb(__export, __import);
            this.loaded.set(name, __export);
            return __export;
        } else {
            throw "No package with the id \"" + name + "\" defined";
        }
    }
}

const bundler = new TSBundler();
bundler.define("1.0.0/fast-cli/0", [], async (__export, __import) => {
	class ArgumentHandler {
	    constructor(flags, attrs) {
	        this.flags = flags;
	        this.attrs = attrs;
	    }
	    hasFlag(name) {
	        for (let flag of this.flags) {
	            if (flag.name == name) {
	                return true;
	            }
	        }
	        return false;
	    }
	    hasAttr(name) {
	        for (let attr of this.attrs) {
	            if (attr.name == name) {
	                return true;
	            }
	        }
	        return false;
	    }
	    getAttr(name) {
	        for (let attr of this.attrs) {
	            if (attr.name == name) {
	                return attr.value;
	            }
	        }
	        return null;
	    }
	    flagLength() {
	        return this.flags.length;
	    }
	    attrLength() {
	        return this.attrs.length;
	    }
	}
	class ArgumentFlag {
	    constructor(name) {
	        this.name = name;
	    }
	}
	class ArgumentAttribute {
	    constructor(name, value) {
	        this.name = name;
	        this.value = value;
	    }
	}
	class Command {
	}
	class CommandConstructor {
	    constructor(name) {
	        this.name = name;
	        this.flags = [];
	        this.attrs = [];
	    }
	    addFlag(name, optional, description) {
	        this.flags.push(new CommandFlag(name, optional, description));
	        return this;
	    }
	    addAttribute(char, name, optional, description) {
	        this.attrs.push(new CommandAttribute(char, name, optional, description));
	        return this;
	    }
	    equals(name, argv) {
	        if (name != this.name) {
	            return false;
	        }
	        for (let attr of this.attrs) {
	            if (attr.optional) {
	                continue;
	            }
	            if (!argv.hasAttr(attr.char)) {
	                return false;
	            }
	        }
	        for (let flag of this.flags) {
	            if (flag.optional) {
	                continue;
	            }
	            if (!argv.hasFlag(flag.name)) {
	                return false;
	            }
	        }
	        return true;
	    }
	    toString(cmd) {
	        let str = this.name + " ";
	        for (let attr of this.attrs) {
	            if (!attr.optional) {
	                str += attr.char + " <" + attr.name + "> ";
	            }
	        }
	        for (let attr of this.attrs) {
	            if (attr.optional) {
	                str += "[" + attr.char + " <" + attr.name + ">] ";
	            }
	        }
	        for (let flag of this.flags) {
	            if (!flag.optional) {
	                str += flag.name + " ";
	            }
	        }
	        for (let flag of this.flags) {
	            if (flag.optional) {
	                str += "[" + flag.name + "] ";
	            }
	        }
	        str += "\n\n";
	        str += cmd.getDescription();
	        str += "\n\n";
	        let size = this.calcSize();
	        for (let attr of this.attrs) {
	            str += attr.char + " ".repeat(size - attr.char.length) + (attr.optional ? "  [OPTIONAL]" : "") + "   " + attr.description + "\n";
	        }
	        for (let flags of this.flags) {
	            str += flags.name + " ".repeat(size - flags.name.length) + (flags.optional ? "  [OPTIONAL]" : "") + "   " + flags.description + "\n";
	        }
	        return str;
	    }
	    calcSize() {
	        let size = 0;
	        this.flags.forEach((x) => {
	            if (x.name.length > size) {
	                size = x.name.length;
	            }
	        });
	        this.attrs.forEach((x) => {
	            if (x.char.length > size) {
	                size = x.char.length;
	            }
	        });
	        return size;
	    }
	}
	class CommandFlag {
	    constructor(name, optional, description) {
	        this.name = name;
	        this.optional = optional;
	        this.description = description;
	    }
	}
	class CommandAttribute {
	    constructor(char, name, optional, description) {
	        this.char = char;
	        this.name = name;
	        this.optional = optional;
	        this.description = description;
	    }
	}
	
	__export["1.0.0/fast-cli/0"] = {};
	__export["1.0.0/fast-cli/0"].ArgumentHandler = ArgumentHandler;
	__export["1.0.0/fast-cli/0"].ArgumentFlag = ArgumentFlag;
	__export["1.0.0/fast-cli/0"].ArgumentAttribute = ArgumentAttribute;
	__export["1.0.0/fast-cli/0"].Command = Command;
	__export["1.0.0/fast-cli/0"].CommandConstructor = CommandConstructor;
	__export["1.0.0/fast-cli/0"].CommandFlag = CommandFlag;
	__export["1.0.0/fast-cli/0"].CommandAttribute = CommandAttribute;
});
bundler.define("1.0.0/fast-cli/1", [], async (__export, __import) => {
	const os = require("os");
	
	let prefix = "";
	function setPrefix(x) {
	    prefix = x;
	}
	async function readline() {
	    return new Promise((resolve) => {
	        process.stdout.write(prefix);
	        process.stdin.once("data", (x) => {
	            let str = x.toString("ascii");
	            resolve(str.substring(0, str.length - os.EOL.length));
	        });
	    });
	}
	async function decision() {
	    return new Promise(async (resolve) => {
	        while (true) {
	            const str = await readline();
	            if (str.toLowerCase() == "y" || str.toLowerCase() == "yes") {
	                resolve(true);
	                break;
	            }
	            else if (str.toLowerCase() == "n" || str.toLowerCase() == "no") {
	                resolve(false);
	                break;
	            }
	        }
	    });
	}
	
	__export["1.0.0/fast-cli/1"] = {};
	__export["1.0.0/fast-cli/1"].readline = readline;
	__export["1.0.0/fast-cli/1"].decision = decision;
});
bundler.define("1.0.0/fast-cli/2", [], async (__export, __import) => {
	var Colors;
	(function (Colors) {
	    Colors["RED"] = "\u001B[31m";
	    Colors["GREEN"] = "\u001B[32m";
	    Colors["YELLOW"] = "\u001B[33m";
	    Colors["BLUE"] = "\u001B[34m";
	    Colors["MAGENTA"] = "\u001B[35m";
	    Colors["CYAN"] = "\u001B[36m";
	    Colors["GRAY"] = "\u001B[37m";
	})(Colors || (Colors = {}));
	const RESET = "\x1b[30m";
	let INFO = Colors.CYAN;
	let ERROR = Colors.RED;
	let LOG = Colors.GRAY;
	let PREFIX_SPACE = 8;
	function set_colors(info, error, log) {
	    INFO = info;
	    ERROR = error;
	    LOG = log;
	}
	function get_colors() {
	    return {
	        info: INFO,
	        error: ERROR,
	        log: LOG
	    };
	}
	function writeln_info(message, ignorePrefix = false) {
	    write_info(message + "\n", ignorePrefix);
	}
	function write_info(message, ignorePrefix = false) {
	    write(INFO, ignorePrefix ? "" : "INFO:", message);
	}
	function writeln_error(message, ignorePrefix = false) {
	    write_error(message + "\n", ignorePrefix);
	}
	function write_error(message, ignorePrefix = false) {
	    write(ERROR, ignorePrefix ? "" : "ERROR:", message);
	}
	function writeln_log(message, ignorePrefix = false) {
	    write_log(message + "\n", ignorePrefix);
	}
	function write_log(message, ignorePrefix = false) {
	    write(LOG, ignorePrefix ? "" : "LOG:", message);
	}
	function write(code, prefix, message) {
	    process.stdout.write(code);
	    process.stdout.write(prefix + (" ".repeat(PREFIX_SPACE - prefix.length)));
	    process.stdout.write(message);
	    process.stdout.write(RESET);
	}
	
	__export["1.0.0/fast-cli/2"] = {};
	__export["1.0.0/fast-cli/2"].Colors = Colors;
	__export["1.0.0/fast-cli/2"].set_colors = set_colors;
	__export["1.0.0/fast-cli/2"].get_colors = get_colors;
	__export["1.0.0/fast-cli/2"].writeln_info = writeln_info;
	__export["1.0.0/fast-cli/2"].write_info = write_info;
	__export["1.0.0/fast-cli/2"].writeln_error = writeln_error;
	__export["1.0.0/fast-cli/2"].write_error = write_error;
	__export["1.0.0/fast-cli/2"].writeln_log = writeln_log;
	__export["1.0.0/fast-cli/2"].write_log = write_log;
});
bundler.define("1.0.0/fast-cli/3", ["1.0.0/fast-cli/0"], async (__export, __import) => {
	const ArgumentAttribute = __import["1.0.0/fast-cli/0"].ArgumentAttribute;
	const ArgumentFlag = __import["1.0.0/fast-cli/0"].ArgumentFlag;
	const ArgumentHandler = __import["1.0.0/fast-cli/0"].ArgumentHandler;
	
	class CLI {
	    constructor(args) {
	        args.shift();
	        args.shift();
	        this.args = args;
	        this.cmds = [];
	    }
	    register(cmd) {
	        this.cmds.push(cmd);
	    }
	    async exec() {
	        const cmdName = this.args[0].startsWith("-") ? null : this.args.shift();
	        const argumentHandler = this.buildArguments();
	        const isHelp = argumentHandler.hasFlag("--help");
	        if (isHelp && cmdName == null && argumentHandler.attrLength() == 0 && argumentHandler.flagLength() == 1) {
	            this.printGlobalHelp();
	            return 0;
	        }
	        else if (cmdName == null) {
	            this.printCommandNotFound();
	            return 1;
	        }
	        for (let cmd of this.cmds) {
	            let command = cmd.getCMD();
	            if (command.equals(cmdName, argumentHandler)) {
	                if (isHelp) {
	                    process.stdout.write(command.toString(cmd));
	                }
	                else {
	                    return await cmd.execute(argumentHandler);
	                }
	            }
	        }
	        this.printCommandNotFound();
	        return 1;
	    }
	    buildArguments() {
	        const attrs = [];
	        const flags = [];
	        this.args.forEach((value, index) => {
	            if (value.startsWith("-") && !this.isFlag(value)) {
	                for (let i = index; i < this.args.length; i++) {
	                    if (!this.isFlag(value)) {
	                        attrs.push(new ArgumentAttribute(value, this.args[i + 1]));
	                        break;
	                    }
	                }
	            }
	            else if (this.isFlag(value)) {
	                flags.push(new ArgumentFlag(value));
	            }
	        });
	        return new ArgumentHandler(flags, attrs);
	    }
	    isFlag(x) {
	        return x.startsWith("--");
	    }
	    printGlobalHelp() {
	    }
	    printCommandNotFound() {
	    }
	}
	
	__export["1.0.0/fast-cli/3"] = {};
	__export["1.0.0/fast-cli/3"].CLI = CLI;
});
bundler.define("1.0.1/yapm/2", ["1.0.1/yapm/0", "1.0.1/yapm/1"], async (__export, __import) => {
	const checkCWD = __import["1.0.1/yapm/0"].checkCWD;
	const checkProjectConfigExists = __import["1.0.1/yapm/0"].checkProjectConfigExists;
	const readConfig = __import["1.0.1/yapm/1"].readConfig;
	const AdmZip = require("adm-zip");
	const path = require("path");
	const fs = require("fs");
	
	
	
	
	
	function createPackage(cwd, out) {
	    checkCWD(cwd);
	    checkProjectConfigExists(cwd);
	    out("==== PACK PROJECT ====");
	    let config = readConfig(cwd);
	    let zip = new AdmZip();
	    fs.readdirSync(cwd).forEach(value => {
	        if (value != "lib" && !value.endsWith(".yapm.zip")) {
	            let entry = path.join(cwd, value);
	            out(`Include: "${entry}"`);
	            if (fs.statSync(entry).isFile()) {
	                zip.addLocalFile(entry);
	            }
	            else if (fs.statSync(entry).isDirectory()) {
	                zip.addLocalFolder(entry, value);
	            }
	        }
	    });
	    out("Write tarball...");
	    const outFile = path.join(cwd, config.name + "-" + config.version + ".yapm.zip");
	    zip.writeZip(outFile);
	    out("Package created");
	    return outFile;
	}
	
	__export["1.0.1/yapm/2"] = {};
	__export["1.0.1/yapm/2"].createPackage = createPackage;
});
bundler.define("1.0.1/yapm/3", [], async (__export, __import) => {
	class WrongFormatException extends Error {
	    constructor(message) {
	        super(message);
	    }
	}
	class StructureException extends Error {
	    constructor(message) {
	        super(message);
	    }
	}
	class FetchError extends Error {
	    constructor(message) {
	        super(message);
	    }
	}
	class ProjectInitException extends Error {
	    constructor(message) {
	        super(message);
	    }
	}
	class WebException extends Error {
	    constructor(message) {
	        super(message);
	    }
	}
	
	__export["1.0.1/yapm/3"] = {};
	__export["1.0.1/yapm/3"].WrongFormatException = WrongFormatException;
	__export["1.0.1/yapm/3"].StructureException = StructureException;
	__export["1.0.1/yapm/3"].FetchError = FetchError;
	__export["1.0.1/yapm/3"].ProjectInitException = ProjectInitException;
	__export["1.0.1/yapm/3"].WebException = WebException;
});
bundler.define("1.0.1/yapm/5", ["1.0.1/yapm/4", "1.0.1/yapm/0", "1.0.1/yapm/3", "1.0.1/yapm/1"], async (__export, __import) => {
	const depToConf = __import["1.0.1/yapm/4"].depToConf;
	const YAPM_TEMPLATE = __import["1.0.1/yapm/4"].YAPM_TEMPLATE;
	const checkLibData = __import["1.0.1/yapm/0"].checkLibData;
	const checkLibRoot = __import["1.0.1/yapm/0"].checkLibRoot;
	const libIsInstalled = __import["1.0.1/yapm/0"].libIsInstalled;
	const saveLib = __import["1.0.1/yapm/0"].saveLib;
	const FetchError = __import["1.0.1/yapm/3"].FetchError;
	const readConfig = __import["1.0.1/yapm/1"].readConfig;
	const readRegisterConfig = __import["1.0.1/yapm/1"].readRegisterConfig;
	const writeConfig = __import["1.0.1/yapm/1"].writeConfig;
	const AdmZip = require("adm-zip");
	const fs = require("fs");
	const url = require("url");
	const path = require("path");
	const os = require("os");
	const http = require("http");
	const child_process = require("child_process");
	
	
	
	
	
	
	
	
	
	
	
	function uninstallPackage(cwd, name, version) {
	    let config = readConfig(cwd);
	    let root = checkLibRoot(cwd);
	    const template = Object.assign({}, YAPM_TEMPLATE);
	    template.name = name;
	    template.version = version;
	    let libRoot = checkLibData(root, template, true);
	    fs.rmSync(libRoot, { recursive: true });
	    config.dependencies.splice(config.dependencies.findIndex(value => value.name == name), 1);
	    writeConfig(cwd, config);
	}
	async function installPackage(fetch, cwd, out) {
	    out("==== INSTALL ====");
	    let yapmConfig = readConfig(cwd);
	    let [resolve, packageConfig] = await installCycle(fetch, cwd, out);
	    let dep = {
	        name: packageConfig.name,
	        version: packageConfig.version,
	        resolve: resolve
	    };
	    if (!dependencyExists(yapmConfig, dep)) {
	        yapmConfig.dependencies.push(dep);
	    }
	    out("Installation finished");
	    writeConfig(cwd, yapmConfig);
	}
	async function installCycle(fetch, cwd, out) {
	    let buff;
	    let url;
	    if (fetch.username == null && fetch.version == null) {
	        buff = await fetchPackageURL(fetch.packageName, out);
	        url = fetch.packageName;
	    }
	    else {
	        let [_, __] = await fetchPackage(fetch.packageName, fetch.username, fetch.version, out);
	        url = _;
	        buff = __;
	    }
	    let zip = new AdmZip(buff);
	    let config = zip.getEntry("yapm.json");
	    if (!config) {
	        throw new FetchError("Error on package file, could not find yapm.json");
	    }
	    let packageYapmConfig = JSON.parse(config.getData().toString("utf-8"));
	    out(`Install package "${packageYapmConfig.name}@${packageYapmConfig.version}"`);
	    saveLib(cwd, zip, packageYapmConfig);
	    for (const value of packageYapmConfig.dependencies) {
	        if (!libIsInstalled(cwd, depToConf(value))) {
	            out(`Install dependency "${value.name}@${value.version}"`);
	            await installCycle({ packageName: value.resolve }, cwd, out);
	        }
	    }
	    return [url, packageYapmConfig];
	}
	async function fetchPackageURL(uri, out) {
	    if (fs.existsSync(uri) && fs.statSync(uri).isFile()) {
	        return fs.readFileSync(uri);
	    }
	    return await fetchURL(uri);
	}
	async function fetchPackage(packageName, username, version, out) {
	    const registers = readRegisterConfig();
	    for (const value of registers) {
	        let url = value.url;
	        url = url.replace(/\{\{package}}/gi, packageName);
	        url = url.replace(/\{\{username}}/gi, username);
	        url = url.replace(/\{\{version}}/gi, version);
	        url = url.replace(/\{\{e-version}}/gi, version.replace(/\./gi, "-"));
	        switch (value.type) {
	            case "GITHUB":
	                out("Fetch Package from " + value.name);
	                if (await urlExists(url)) {
	                    return [url, await fetchURL(url)];
	                }
	            case "GIT":
	                break;
	            case "YAPM-REG":
	                break;
	        }
	    }
	    throw new FetchError("Cannot resolve " + packageName);
	}
	async function urlExists(uri) {
	    return new Promise((resolve) => {
	        let req = http.request({
	            method: "HEAD",
	            host: url.parse(uri).hostname,
	            port: 80,
	            path: url.parse(uri).pathname
	        }, (res) => {
	            res.on("error", (err) => {
	                console.log(err.message);
	            });
	            resolve(res.statusCode.toString()[0] == "3" || res.statusCode.toString()[0] == "2");
	        });
	        req.end();
	    });
	}
	async function fetchURL(uri) {
	    return new Promise((resolve, reject) => {
	        let tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "yapm"));
	        let tmpFile = path.join(tmpDir, "download.zip");
	        let cmd;
	        if (process.platform == "win32") {
	            cmd = `Powershell.exe -Command "Invoke-RestMethod -Uri ${uri} -OutFile ${tmpFile}"`;
	        }
	        else if (process.platform == "darwin" || process.platform == "linux") {
	            cmd = `curl ${uri} > ${tmpFile}`;
	        }
	        child_process.execSync(cmd, {
	            windowsHide: true
	        });
	        let buff = fs.readFileSync(tmpFile);
	        resolve(buff);
	    });
	}
	function dependencyExists(config, dep) {
	    for (let dependency of config.dependencies) {
	        if (dependency.name == dep.name && dependency.version == dep.version) {
	            return true;
	        }
	    }
	    return false;
	}
	
	__export["1.0.1/yapm/5"] = {};
	__export["1.0.1/yapm/5"].installPackage = installPackage;
	__export["1.0.1/yapm/5"].fetchPackageURL = fetchPackageURL;
	__export["1.0.1/yapm/5"].fetchPackage = fetchPackage;
});
bundler.define("1.0.1/yapm/1", ["1.0.1/yapm/0", "1.0.1/yapm/3"], async (__export, __import) => {
	const checkCWD = __import["1.0.1/yapm/0"].checkCWD;
	const checkLibConfigFormat = __import["1.0.1/yapm/0"].checkLibConfigFormat;
	const checkProjectConfigExists = __import["1.0.1/yapm/0"].checkProjectConfigExists;
	const ProjectInitException = __import["1.0.1/yapm/3"].ProjectInitException;
	const WrongFormatException = __import["1.0.1/yapm/3"].WrongFormatException;
	const fs = require("fs");
	const path = require("path");
	
	
	
	
	function readConfig(cwd) {
	    if (!checkProjectConfigExists(cwd)) {
	        throw new ProjectInitException("Project not initialised");
	    }
	    const content = fs.readFileSync(path.join(cwd, "yapm.json"), "utf-8");
	    if (checkLibConfigFormat(content)) {
	        return JSON.parse(content);
	    }
	    else {
	        throw new WrongFormatException("wrong format in yapm.json");
	    }
	}
	function writeConfig(cwd, config) {
	    checkCWD(cwd);
	    checkProjectConfigExists(cwd);
	    fs.writeFileSync(path.join(cwd, "yapm.json"), JSON.stringify(config, null, 4));
	}
	function getRegisterPath() {
	    const appData = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
	    const base = path.join(appData, "yapm");
	    const config = path.join(base, "register.json");
	    if (!fs.existsSync(base) || !fs.statSync(base).isDirectory()) {
	        fs.mkdirSync(base);
	        fs.writeFileSync(config, JSON.stringify([
	            {
	                type: "GITHUB",
	                name: "github.com",
	                url: "http://github.com/{{username}}/{{package}}/releases/download/{{version}}/{{package}}-{{e-version}}.yapm.tar"
	            }
	        ]));
	    }
	    return config;
	}
	function readRegisterConfig() {
	    const p = getRegisterPath();
	    try {
	        return JSON.parse(fs.readFileSync(p, "utf-8"));
	    }
	    catch (err) {
	        throw new WrongFormatException("Register file has wrong format");
	    }
	}
	function writeRegisterConfig(registers) {
	    const p = getRegisterPath();
	    fs.writeFileSync(p, JSON.stringify(registers));
	}
	
	__export["1.0.1/yapm/1"] = {};
	__export["1.0.1/yapm/1"].readConfig = readConfig;
	__export["1.0.1/yapm/1"].writeConfig = writeConfig;
	__export["1.0.1/yapm/1"].readRegisterConfig = readRegisterConfig;
	__export["1.0.1/yapm/1"].writeRegisterConfig = writeRegisterConfig;
});
bundler.define("1.0.1/yapm/0", ["1.0.1/yapm/4", "1.0.1/yapm/3"], async (__export, __import) => {
	const YAPM_TEMPLATE = __import["1.0.1/yapm/4"].YAPM_TEMPLATE;
	const StructureException = __import["1.0.1/yapm/3"].StructureException;
	const fs = require("fs");
	const path = require("path");
	
	
	
	
	function checkCWD(cwd) {
	    if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) {
	        throw new StructureException("Current working directory doesnt exists");
	    }
	}
	function checkLibRoot(cwd, throw_) {
	    checkCWD(cwd);
	    const libRoot = path.join(cwd, "lib");
	    if (!fs.existsSync(libRoot) || !fs.statSync(libRoot).isDirectory()) {
	        if (throw_) {
	            throw new StructureException("Lib collection root folder doesn't exists");
	        }
	        fs.mkdirSync(libRoot);
	    }
	    return libRoot;
	}
	function checkLibData(root, conf, throw_) {
	    if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
	        throw new StructureException("Lib collection root folder doesn't exists");
	    }
	    const libRoot = path.join(root, conf.name);
	    if (!fs.existsSync(libRoot) || !fs.statSync(libRoot).isDirectory()) {
	        if (throw_) {
	            throw new StructureException("Lib folder doesn't exists");
	        }
	        fs.mkdirSync(libRoot);
	    }
	    const versionRoot = path.join(libRoot, conf.version);
	    if (!fs.existsSync(versionRoot) || !fs.statSync(versionRoot).isDirectory()) {
	        if (throw_) {
	            throw new StructureException("Lib version folder doesn't exists");
	        }
	        fs.mkdirSync(versionRoot);
	    }
	    if (fs.readdirSync(versionRoot).length != 0) {
	        fs.rmdirSync(versionRoot, { recursive: true });
	        return checkLibData(root, conf);
	    }
	    return versionRoot;
	}
	function checkLibConfig(libRoot) {
	    if (!fs.existsSync(libRoot) || !fs.statSync(libRoot).isDirectory()) {
	        throw new StructureException("Lib version root folder doesn't exists");
	    }
	    let confFile = path.join(libRoot, "yapm.json");
	    if (!fs.existsSync(confFile) || !fs.statSync(confFile).isFile()) {
	        return false;
	    }
	    return checkLibConfigFormat(fs.readFileSync(confFile, "utf-8"));
	}
	function checkLibConfigFormat(content) {
	    try {
	        let oKeys = Object.keys(JSON.parse(content));
	        for (let key of Object.keys(YAPM_TEMPLATE)) {
	            if (!oKeys.includes(key)) {
	                return false;
	            }
	        }
	    }
	    catch {
	        return false;
	    }
	    return true;
	}
	function saveLib(cwd, buff, conf) {
	    const root = checkLibRoot(cwd);
	    const libRoot = checkLibData(root, conf);
	    buff.extractAllTo(libRoot, true);
	}
	function libIsInstalled(cwd, conf) {
	    try {
	        let root = checkLibRoot(cwd, true);
	        let libRoot = checkLibData(root, conf, true);
	        return checkLibConfig(libRoot);
	    }
	    catch {
	        return false;
	    }
	}
	function checkProjectConfigExists(cwd) {
	    checkCWD(cwd);
	    const configFile = path.join(cwd, "yapm.json");
	    return fs.existsSync(configFile) && fs.statSync(configFile).isFile();
	}
	
	__export["1.0.1/yapm/0"] = {};
	__export["1.0.1/yapm/0"].checkCWD = checkCWD;
	__export["1.0.1/yapm/0"].checkLibRoot = checkLibRoot;
	__export["1.0.1/yapm/0"].checkLibData = checkLibData;
	__export["1.0.1/yapm/0"].checkLibConfig = checkLibConfig;
	__export["1.0.1/yapm/0"].checkLibConfigFormat = checkLibConfigFormat;
	__export["1.0.1/yapm/0"].saveLib = saveLib;
	__export["1.0.1/yapm/0"].libIsInstalled = libIsInstalled;
	__export["1.0.1/yapm/0"].checkProjectConfigExists = checkProjectConfigExists;
});
bundler.define("1.0.1/yapm/6", ["1.0.1/yapm/5"], async (__export, __import) => {
	const fetchPackage = __import["1.0.1/yapm/5"].fetchPackage;
	
	(async () => {
	    console.log("TRY FETCH PACKAGE");
	    let [res, buff] = await fetchPackage("yapm", "Christoph-Koschel", "1.0.1", console.log);
	    console.log(res, buff);
	})().then(() => process.exit(0));
	
	__export["1.0.1/yapm/6"] = {};
});
bundler.define("1.0.1/yapm/4", [], async (__export, __import) => {
	function depToConf(dep) {
	    return {
	        name: dep.name,
	        version: dep.version,
	        author: "<conversion>",
	        license: "<conversion>",
	        dependencies: []
	    };
	}
	const YAPM_TEMPLATE = {
	    name: "",
	    version: "",
	    dependencies: [],
	    license: "",
	    author: ""
	};
	
	__export["1.0.1/yapm/4"] = {};
	__export["1.0.1/yapm/4"].depToConf = depToConf;
	__export["1.0.1/yapm/4"].YAPM_TEMPLATE = YAPM_TEMPLATE;
});
// M:\langs\bun\tsb-new\build\src\bin\tsb.js
bundler.define("tsb/14", ["1.0.0/fast-cli/3", "1.0.0/fast-cli/2", "tsb/11", "tsb/12", "tsb/13", "1.0.0/fast-cli/2"], async (__export, __import) => {
	const CLI = __import["1.0.0/fast-cli/3"].CLI;
	const Colors = __import["1.0.0/fast-cli/2"].Colors;
	const Init = __import["tsb/11"].Init;
	const Compile = __import["tsb/12"].Compile;
	const Generate = __import["tsb/13"].Generate;
	const output = __import["1.0.0/fast-cli/2"];
	
	
	
	
	
	
	
	const cli = new CLI(process.argv);
	output.set_colors(Colors.CYAN, Colors.RED, Colors.GRAY);
	cli.register(new Init());
	cli.register(new Compile());
	cli.register(new Generate());
	cli.exec().then((c) => {
	    process.exit(c);
	});
	
	__export["tsb/14"] = {};
});
// M:\langs\bun\tsb-new\build\src\commands\Compile.js
bundler.define("tsb/12", ["1.0.0/fast-cli/0", "1.0.1/yapm/0", "tsb/15", "1.0.1/yapm/1", "tsb/16", "tsb/17", "1.0.1/yapm/2", "1.0.0/fast-cli/2"], async (__export, __import) => {
	const Command = __import["1.0.0/fast-cli/0"].Command;
	const CommandConstructor = __import["1.0.0/fast-cli/0"].CommandConstructor;
	const checkProjectConfigExists = __import["1.0.1/yapm/0"].checkProjectConfigExists;
	const cwd = __import["tsb/15"].cwd;
	const readConfig = __import["1.0.1/yapm/1"].readConfig;
	const getWrapper = __import["tsb/16"].getWrapper;
	const SymbolTable = __import["tsb/16"].SymbolTable;
	const {execSync} = require("child_process");
	const moveOneIn = __import["tsb/17"].moveOneIn;
	const overwriteFiles = __import["tsb/17"].overwriteFiles;
	const {minify} = require("uglify-js");
	const createPackage = __import["1.0.1/yapm/2"].createPackage;
	const output = __import["1.0.0/fast-cli/2"];
	const fs = require("fs");
	const path = require("path");
	const os = require("os");
	
	
	
	
	
	
	
	
	
	
	
	
	
	class Compile extends Command {
	    async execute(argv) {
	        if (!checkProjectConfigExists(cwd)) {
	            output.writeln_error("No project initialized");
	            return 1;
	        }
	        output.writeln_log("==== INIT PROJECT ====");
	        let config = readConfig(cwd);
	        if (fs.existsSync(path.join(cwd, "build")) && fs.statSync(path.join(cwd, "build")).isDirectory()) {
	            output.writeln_log("Clean up old build");
	            fs.rmSync(path.join(cwd, "build"), { recursive: true });
	        }
	        let { writeStream, symbols, library, dynamic, resolveFiles } = this.compileFiles(config, argv);
	        if (argv.hasFlag("--minify")) {
	            output.writeln_log("Minify code");
	            let res = minify(writeStream);
	            if (!!res.error) {
	                console.log(res.error.message);
	            }
	            else {
	                writeStream = res.code;
	            }
	        }
	        else {
	            writeStream.replace(/(\r\n|\r|\n)+/gm, "\n");
	        }
	        output.writeln_log("Save output");
	        fs.writeFileSync(path.join(cwd, "build", config.name + ".c.js"), writeStream);
	        this.generateLibrary(library, resolveFiles, symbols, config, dynamic);
	        return 0;
	    }
	    generateLibrary(library, resolveFiles, symbols, config, dynamic) {
	        if (library) {
	            let tmp = fs.mkdtempSync(path.join(os.tmpdir(), "tsb"));
	            fs.copyFileSync(path.join(cwd, "yapm.json"), path.join(tmp, "yapm.json"));
	            let c = {};
	            const files = resolveFiles(path.join(cwd, "build", "src"));
	            files.forEach(file => {
	                const key = file.replace(/\\/gi, "/").replace(path.join(cwd, "build", "src").replace(/\\/gi, "/"), "");
	                c[key] = symbols.load(file, library, config);
	            });
	            fs.writeFileSync(path.join(tmp, "tsb.json"), JSON.stringify(c, null, 4));
	            function copyTree(p, dest, ext) {
	                fs.readdirSync(p).forEach(value => {
	                    if (fs.statSync(path.join(p, value)).isDirectory()) {
	                        copyTree(path.join(p, value), path.join(dest, value), ext);
	                    }
	                    else if (fs.statSync(path.join(p, value)).isFile() && value.endsWith(ext)) {
	                        if (!fs.existsSync(dest) || !fs.statSync(dest).isDirectory()) {
	                            fs.mkdirSync(dest, { recursive: true });
	                        }
	                        fs.copyFileSync(path.join(p, value), path.join(dest, value));
	                    }
	                });
	            }
	            copyTree(path.join(cwd, "build", "header"), path.join(tmp), ".d.ts");
	            if (!dynamic) {
	                fs.copyFileSync(path.join(cwd, "build", config.name + ".c.js"), path.join(tmp, config.name + ".c.js"));
	            }
	            output.writeln_log("", true);
	            let file = createPackage(tmp, (msg) => {
	                output.writeln_log(msg);
	            });
	            output.writeln_log("Copy tarball to the output");
	            fs.copyFileSync(file, path.join(cwd, path.basename(file)));
	        }
	    }
	    compileFiles(config, argv) {
	        let writeStream = "";
	        const symbols = new SymbolTable(config);
	        const library = argv.hasFlag("--lib");
	        const writeComments = !argv.hasFlag("--no-comments") && !library;
	        const dynamic = argv.hasFlag("--dynamic");
	        this.initLibraries(symbols);
	        output.writeln_log("", true);
	        output.writeln_log("==== COMPILE PROJECT ====");
	        output.writeln_log("Compile typescript");
	        execSync("tsc", {
	            cwd: cwd,
	            stdio: "inherit",
	            windowsHide: true,
	            encoding: "utf8"
	        });
	        function resolveFiles(p, extension = ".js", excludeCompilerFiles = true) {
	            let files = [];
	            fs.readdirSync(p).forEach((entry) => {
	                let x = path.join(p, entry);
	                if (fs.statSync(x).isDirectory()) {
	                    files.push(...resolveFiles(x));
	                }
	                else if (x.endsWith(extension) && (!x.endsWith(".c.js") || !excludeCompilerFiles)) {
	                    files.push(x);
	                }
	            });
	            return files;
	        }
	        let files = resolveFiles(path.join(cwd, "build", "src"));
	        if (!library) {
	            writeStream += (getWrapper());
	            fs.readdirSync(path.join(cwd, "lib")).forEach((lib) => {
	                for (const version of fs.readdirSync(path.join(cwd, "lib", lib))) {
	                    let p = path.join(cwd, "lib", lib, version);
	                    const files = resolveFiles(p, ".c.js", false);
	                    output.writeln_log(`Checkup ${lib}@${version}`);
	                    files.forEach(file => {
	                        output.writeln_log(`Write ${file}`, true);
	                        writeStream += fs.readFileSync(file, "utf8");
	                    });
	                }
	            });
	        }
	        let [shBang, fileContents] = overwriteFiles(files);
	        if (shBang) {
	            writeStream = "#!/usr/bin/env node\n" + writeStream;
	        }
	        output.writeln_log("Put things together");
	        fileContents.forEach(([file, content, imports, exports], index, array) => {
	            output.writeln_log(`Add [${index + 1}|${array.length}] "${file}"`, true);
	            if (writeComments) {
	                writeStream += ("// " + file + os.EOL);
	            }
	            let ref = "";
	            imports.filter(value => value.importType != "npm").forEach((value, index) => {
	                if (index != 0) {
	                    ref += ", ";
	                }
	                ref += `"${symbols.load(value.src, library, config)}"`;
	            });
	            writeStream += (`bundler.define("${symbols.load(file, library, config)}", [${ref}], async (__export, __import) => {` + os.EOL);
	            imports.forEach(value => {
	                switch (value.importType) {
	                    case "lib":
	                    case "file":
	                        value.types.forEach((x) => {
	                            if (value.importResult == "obj") {
	                                writeStream += (moveOneIn(`const ${x} = __import["${symbols.load(value.src, library, config)}"].${x};`));
	                            }
	                            else if (value.importResult == "bundle") {
	                                writeStream += (moveOneIn(`const ${x} = __import["${symbols.load(value.src, library, config)}"];`));
	                            }
	                            else if (value.importResult == "default") {
	                                writeStream += (moveOneIn(`const ${value.types[0]} = __import["${symbols.load(value.src, library, config)}"].default;`));
	                            }
	                        });
	                        break;
	                    case "npm":
	                        if (value.importResult == "obj") {
	                            writeStream += (moveOneIn(`const {${value.types.join(",")}} = require("${value.src}");`));
	                        }
	                        else if (value.importResult == "bundle") {
	                            writeStream += (moveOneIn(`const ${value.types[0]} = require("${value.src}");`));
	                        }
	                        else if (value.importResult == "default") {
	                            writeStream += (moveOneIn(`const ${value.types[0]} = require("${value.src}").default;`));
	                        }
	                        else if (value.importResult == "load") {
	                            writeStream += (moveOneIn(`require("${value.src}");`));
	                        }
	                        break;
	                }
	            });
	            writeStream += (moveOneIn(content));
	            writeStream += (moveOneIn(`__export["${symbols.load(file, library, config)}"] = {};`));
	            exports.forEach(value => {
	                if (value.exportType == "normal") {
	                    writeStream += (moveOneIn(`__export["${symbols.load(value.file, library, config)}"].${value.name} = ${value.name};`));
	                }
	                else if (value.exportType == "default") {
	                    writeStream += (moveOneIn(`__export["${symbols.load(value.file, library, config)}"].default = ${value.name};`));
	                }
	            });
	            writeStream += ("});" + os.EOL);
	        });
	        if (argv.hasAttr("-m")) {
	            output.writeln_log("Write load point");
	            let main = argv.getAttr("-m");
	            main = path.join(cwd, "build", "src", main + ".js");
	            if (fs.existsSync(main) && fs.statSync(main).isFile()) {
	                if (writeComments) {
	                    writeStream += ("// Entry point call" + os.EOL);
	                }
	                writeStream += (`bundler.load("${symbols.load(main, library, config)}");\n`);
	            }
	        }
	        if (!library) {
	            writeStream += ("bundler.start();");
	        }
	        return { writeStream, symbols, library, dynamic, resolveFiles };
	    }
	    initLibraries(symbols) {
	        output.writeln_log("Search for libraries");
	        if (fs.existsSync(path.join(cwd, "lib")) && fs.statSync(path.join(cwd, "lib")).isDirectory()) {
	            fs.readdirSync(path.join(cwd, "lib")).forEach((lib) => {
	                for (const version of fs.readdirSync(path.join(cwd, "lib", lib))) {
	                    let p = path.join(cwd, "lib", lib, version);
	                    if (fs.existsSync(path.join(p, "tsb.json")) && fs.statSync(path.join(p, "tsb.json")).isFile()) {
	                        try {
	                            output.writeln_log(`Found ${lib}@${version}`, true);
	                            let x = JSON.parse(fs.readFileSync(path.join(p, "tsb.json"), "utf8"));
	                            Object.keys(x).forEach((key) => {
	                                let parsed = path.parse(key);
	                                symbols.set(`@yapm/${lib}/${version}${parsed.dir + (parsed.dir == "/" ? "" : "/") + parsed.name}`, x[key]);
	                            });
	                        }
	                        catch (err) {
	                            break;
	                        }
	                    }
	                }
	            });
	        }
	    }
	    getCMD() {
	        return new CommandConstructor("compile")
	            .addAttribute("-m", "main", true, "The file who should declared as the entry point")
	            .addFlag("--lib", true, "Compiles and packs all source files as a yapm library")
	            .addFlag("--dynamic", true, "Packs just the header files as a yapm library (needs the --lib flag)")
	            .addFlag("--no-comments", true, "Don't write comments to the output file")
	            .addFlag("--minify", true, "Minifies the output files");
	    }
	    getDescription() {
	        return "Compiles the project";
	    }
	}
	
	__export["tsb/12"] = {};
	__export["tsb/12"].Compile = Compile;
});
// M:\langs\bun\tsb-new\build\src\commands\Generate.js
bundler.define("tsb/13", ["1.0.0/fast-cli/0", "1.0.1/yapm/0", "tsb/15", "tsb/16", "1.0.0/fast-cli/2"], async (__export, __import) => {
	const Command = __import["1.0.0/fast-cli/0"].Command;
	const CommandConstructor = __import["1.0.0/fast-cli/0"].CommandConstructor;
	const checkProjectConfigExists = __import["1.0.1/yapm/0"].checkProjectConfigExists;
	const cwd = __import["tsb/15"].cwd;
	const getResourcesWrapper = __import["tsb/16"].getResourcesWrapper;
	const output = __import["1.0.0/fast-cli/2"];
	const path = require("path");
	const fs = require("fs");
	
	
	
	
	
	
	
	class Generate extends Command {
	    async execute(argv) {
	        if (!checkProjectConfigExists(cwd)) {
	            output.writeln_error("No project initialized");
	            return 1;
	        }
	        let p = path.join(cwd, argv.getAttr("-d"));
	        function lookupTree(p) {
	            let entries = [];
	            fs.readdirSync(p).forEach(value => {
	                if (fs.statSync(path.join(p, value)).isDirectory()) {
	                    entries.push(...lookupTree(path.join(p, value)));
	                }
	                else if (fs.statSync(path.join(p, value)).isFile() && !value.endsWith(".yapm.tar")) {
	                    output.writeln_log(`Found "${path.join(p, value)}"`, true);
	                    entries.push(path.join(p, value));
	                }
	            });
	            return entries;
	        }
	        if (!fs.existsSync(p) || !fs.statSync(p).isDirectory()) {
	            output.writeln_error(`Path "${p}" do not exist`);
	            return 1;
	        }
	        output.writeln_log("Lookup for files");
	        let files = lookupTree(p);
	        console.log(files);
	        let content = getResourcesWrapper();
	        let rHeader = {};
	        let r = {};
	        let conversion = {};
	        output.writeln_log("Registers files");
	        files.forEach((file, index, array) => {
	            output.writeln_log(`Register [${index + 1}|${array.length}] ${index} => "${file}"`, true);
	            let base = file.replace(p + "\\", "");
	            let parts = base.split("\\");
	            function updateObj(parts, r, rHeader, conversion) {
	                let key = parts.shift();
	                key = key.replace(/\./gi, "_");
	                if (parts.length == 0) {
	                    r[key] = { id: index };
	                    rHeader[key] = "ResourcesID";
	                    conversion[key] = file;
	                }
	                if (r[key] == undefined) {
	                    r[key] = {};
	                    rHeader[key] = {};
	                    conversion[key] = {};
	                }
	                if (parts.length > 0) {
	                    updateObj(parts, r[key], rHeader[key], conversion[key]);
	                }
	            }
	            updateObj(parts.slice(), r, rHeader, conversion);
	        });
	        function writeObj(obj, nested) {
	            let str = "{\n";
	            let bounds = " ".repeat(nested);
	            Object.keys(obj).forEach((value, index, array) => {
	                let bounds = " ".repeat(nested + 4);
	                str += bounds + value;
	                str += ": ";
	                if (typeof obj[value] == "object") {
	                    str += writeObj(obj[value], nested + 4);
	                }
	                else {
	                    str += obj[value];
	                }
	                str += array.length - 1 == index ? "\n" : ",\n";
	            });
	            str += bounds + "}";
	            return str;
	        }
	        content += `\n${"export"} const R: ${writeObj(rHeader, 0)} = ${writeObj(r, 0)};\n\n`;
	        output.writeln_log("Bundle resource files");
	        function writeData(obj, key) {
	            output.writeln_log("Write group: " + key);
	            Object.keys(obj).forEach((value, index, array) => {
	                if (typeof obj[value] == "object") {
	                    writeData(obj[value], key + "." + value);
	                }
	                else {
	                    output.writeln_log(`Bundle [${index + 1}|${array.length}] ${key + "." + value} => "${obj[value]}"`, true);
	                    content += `data.set(${key + "." + value + ".id"}, "${fs.readFileSync(obj[value], "base64")}");\n`;
	                }
	            });
	        }
	        writeData(conversion, "R");
	        const outputPath = path.join(cwd, "src", "resources.ts");
	        if (fs.existsSync(outputPath) && fs.statSync(outputPath).isFile() && !argv.hasFlag("--force")) {
	            output.write_error("resources.ts already exists. Delete the file manually or use the force flag");
	            return 1;
	        }
	        else {
	            output.writeln_log("Write \"resources.ts\"");
	            fs.writeFileSync(outputPath, content);
	        }
	        return 0;
	    }
	    getCMD() {
	        return new CommandConstructor("generate")
	            .addAttribute("-d", "Directory", false, "The directory for the resources generation")
	            .addFlag("--force", true, "Forces the generation");
	    }
	    getDescription() {
	        return "Bundles non TypesScript / JavaScript files and produces a resources.ts file in the root of the src folder";
	    }
	}
	
	__export["tsb/13"] = {};
	__export["tsb/13"].Generate = Generate;
});
// M:\langs\bun\tsb-new\build\src\commands\Init.js
bundler.define("tsb/11", ["1.0.0/fast-cli/0", "1.0.0/fast-cli/1", "1.0.1/yapm/1", "tsb/15", "tsb/16"], async (__export, __import) => {
	const Command = __import["1.0.0/fast-cli/0"].Command;
	const CommandConstructor = __import["1.0.0/fast-cli/0"].CommandConstructor;
	const decision = __import["1.0.0/fast-cli/1"].decision;
	const readline = __import["1.0.0/fast-cli/1"].readline;
	const writeConfig = __import["1.0.1/yapm/1"].writeConfig;
	const cwd = __import["tsb/15"].cwd;
	const createTSConfig = __import["tsb/16"].createTSConfig;
	const fs = require("fs");
	const path = require("path");
	
	
	
	
	
	
	
	class Init extends Command {
	    async execute(argv) {
	        process.stdout.write("Name: ");
	        let name = await readline();
	        process.stdout.write("Author: ");
	        let author = await readline();
	        process.stdout.write("Version (1.0.0): ");
	        let version = await readline();
	        version = version == "" ? "1.0.0" : version;
	        process.stdout.write("License (MIT): ");
	        let license = await readline();
	        license = license == "" ? "MIT" : license;
	        process.stdout.write("Create Git Action for publishment?");
	        let gitAction = await decision();
	        writeConfig(cwd, {
	            name: name,
	            author: author,
	            version: version,
	            license: license,
	            dependencies: []
	        });
	        if (gitAction) {
	            let githubFolder = path.join(cwd, ".github");
	            if (!fs.existsSync(githubFolder) || !fs.statSync(githubFolder).isDirectory()) {
	                fs.mkdirSync(githubFolder);
	            }
	            let workflowFolder = path.join(githubFolder, "workflows");
	            if (!fs.existsSync(workflowFolder) || !fs.statSync(workflowFolder).isDirectory()) {
	                fs.mkdirSync(workflowFolder);
	            }
	        }
	        createTSConfig(cwd);
	        if (!fs.existsSync(path.join(cwd, "src")) || fs.statSync(path.join(cwd, "src")).isFile()) {
	            fs.mkdirSync(path.join(cwd, "src"));
	        }
	        if (!fs.existsSync(path.join(cwd, "lib")) || fs.statSync(path.join(cwd, "lib")).isFile()) {
	            fs.mkdirSync(path.join(cwd, "lib"));
	        }
	        return 0;
	    }
	    getCMD() {
	        return new CommandConstructor("init");
	    }
	    getDescription() {
	        return "Inits a new tsb project";
	    }
	}
	
	__export["tsb/11"] = {};
	__export["tsb/11"].Init = Init;
});
// M:\langs\bun\tsb-new\build\src\compiler.js
bundler.define("tsb/17", ["1.0.0/fast-cli/2"], async (__export, __import) => {
	const fs = require("fs");
	const path = require("path");
	const os = require("os");
	const output = __import["1.0.0/fast-cli/2"];
	
	
	
	
	const importObjRegex = /(import\s{1,}{.*}\s{1,}from\s*".*"\s*;)|(import\s{1,}{.*}\s{1,}from\s".{1,}")/gi;
	const importBundleRegex = /(import\s{1,}\*\s{1,}as\s{1,}\w{1,}\s{1,}from\s{1,}".*"\s*;)|(import\s*\*\s{1,}as\s{1,}\w{1,}\s{1,}from\s{1,}".*")/gi;
	const importDefaultRegex = /(import\s{1,}\w{1,}\s{1,}from\s{1,}".*"\s*;)|(import\s{1,}\w{1,}\s{1,}from\s{1,}".*")/gi;
	const importRegex = /(import\s*".*"\s*;)|(import\s*".*")/gi;
	const exportRegex = /export\s{1,}\w{1,}\s{1,}\w{1,}/gi;
	const exportDefaultRegex = /export\s{1,}default\s{1,}\w{1,}\s{1,}\w{1,}/gi;
	const exportAsyncRegex = /export\s{1,}async\s{1,}function\s{1,}\w{1,}/gi;
	const exportNoneRegex = /(export\s{1,}\{}\s*;)|(export\s{1,}\{};)/gi;
	function overwriteFiles(files) {
	    let content = [];
	    let shBang = false;
	    output.writeln_log("Prepare files");
	    files.forEach((file, index, array) => {
	        let [_shBang, res] = overwriteFile(file);
	        if (_shBang) {
	            shBang = true;
	        }
	        content.push(res);
	        output.writeln_log(`Prepare [${index + 1}|${array.length}] "${file}"`, true);
	    });
	    return [shBang, content];
	}
	function extractImports(content, file) {
	    let match;
	    let imports = [];
	    match = content.match(importObjRegex);
	    if (match != null) {
	        match.forEach((include) => {
	            content = content.replace(include, "");
	            let items = include.match(/{.*}/gi);
	            if (items != null) {
	                let types = items[0].substring(1, items[0].length - 1).split(",");
	                for (let i = 0; i < types.length; i++) {
	                    types[i] = types[i].trim();
	                }
	                items = include.match(/".*"/gi);
	                if (items != null) {
	                    let item = items[0].substring(1, items[0].length - 1);
	                    let src;
	                    let type;
	                    if (item.startsWith("@yapm")) {
	                        type = "lib";
	                        src = item;
	                    }
	                    else if (item.startsWith(".") || path.isAbsolute(item)) {
	                        src = path.join(path.dirname(file), item) + ".js";
	                        type = "file";
	                    }
	                    else {
	                        type = "npm";
	                        src = item;
	                    }
	                    imports.push({
	                        src: src,
	                        importType: type,
	                        importResult: "obj",
	                        types: types,
	                        file: file
	                    });
	                }
	            }
	        });
	    }
	    match = content.match(importBundleRegex);
	    if (match != null) {
	        match.forEach((include) => {
	            content = content.replace(include, "");
	            let nameReg = include.match(/import\s*\*\s*as\s*\w*/gi);
	            let name = nameReg[0].split(" ").pop();
	            let items = include.match(/".*"/gi);
	            if (items != null) {
	                let item = items[0].substring(1, items[0].length - 1);
	                let src;
	                let type;
	                if (item.startsWith("@yapm")) {
	                    type = "lib";
	                    src = item;
	                }
	                else if (item.startsWith(".") || path.isAbsolute(item)) {
	                    src = path.join(path.dirname(file), item) + ".js";
	                    type = "file";
	                }
	                else {
	                    type = "npm";
	                    src = item;
	                }
	                imports.push({
	                    src: src,
	                    importType: type,
	                    importResult: "bundle",
	                    types: [name],
	                    file: file
	                });
	            }
	        });
	    }
	    match = content.match(importDefaultRegex);
	    if (match != null) {
	        match.forEach((include) => {
	            content = content.replace(include, "");
	            let nameReg = include.match(/import\s*\w*/gi);
	            let name = nameReg[0].split(" ").pop();
	            let items = include.match(/".*"/gi);
	            if (items != null) {
	                let item = items[0].substring(1, items[0].length - 1);
	                let src;
	                let type;
	                if (item.startsWith("@yapm")) {
	                    type = "lib";
	                    src = item;
	                }
	                else if (item.startsWith(".") || path.isAbsolute(item)) {
	                    src = path.join(path.dirname(file), item) + ".js";
	                    type = "file";
	                }
	                else {
	                    type = "npm";
	                    src = item;
	                }
	                imports.push({
	                    src: src,
	                    importType: type,
	                    importResult: "default",
	                    types: [name],
	                    file: file
	                });
	            }
	        });
	    }
	    match = content.match(importRegex);
	    if (match != null) {
	        match.forEach((include) => {
	            content = content.replace(include, "");
	            let items = include.match(/".*"/gi);
	            if (items != null) {
	                let item = items[0].substring(1, items[0].length - 1);
	                let src;
	                let type;
	                if (item.startsWith("@yapm")) {
	                    type = "lib";
	                    src = item;
	                }
	                else if (item.startsWith(".") || path.isAbsolute(item)) {
	                    src = path.join(path.dirname(file), item) + ".js";
	                    type = "file";
	                }
	                else {
	                    type = "npm";
	                    src = item;
	                }
	                imports.push({
	                    src: src,
	                    importType: type,
	                    importResult: "load",
	                    types: [],
	                    file: file
	                });
	            }
	        });
	    }
	    return [content, imports];
	}
	function extractExports(content, file) {
	    let match;
	    let exports = [];
	    match = content.match(exportDefaultRegex);
	    if (match != null) {
	        match.forEach((exclude) => {
	            content = content.replace(/export\s{1,}default\s{1,}/gi, "");
	            let words = exclude.split(" ");
	            exports.push({
	                name: words[words.length - 1].trim(),
	                exportType: "default",
	                file: file
	            });
	        });
	    }
	    match = content.match(exportAsyncRegex);
	    if (match != null) {
	        match.forEach((exclude) => {
	            content = content.replace(/export\s{1,}/gi, "");
	            let words = exclude.split(" ");
	            exports.push({
	                name: words[words.length - 1].trim(),
	                exportType: "normal",
	                file: file
	            });
	        });
	    }
	    match = content.match(exportRegex);
	    if (match != null) {
	        match.forEach((exclude) => {
	            content = content.replace(/export\s{1,}/gi, "");
	            let words = exclude.split(" ");
	            exports.push({
	                name: words[words.length - 1].trim(),
	                exportType: "normal",
	                file: file
	            });
	        });
	    }
	    match = content.match(exportNoneRegex);
	    if (match != null) {
	        match.forEach((exclude) => {
	            content = content.replace(exclude, "");
	        });
	    }
	    return [content, exports];
	}
	function overwriteFile(file) {
	    let content = fs.readFileSync(file, "utf8");
	    let shBang = false;
	    let match = content.match(/^\s*#!.*/g);
	    if (match != null) {
	        match.forEach(value => {
	            content = content.replace(value, "");
	        });
	        shBang = true;
	    }
	    let [_, imports] = extractImports(content, file);
	    content = _;
	    let [__, exports] = extractExports(content, file);
	    content = __;
	    return [shBang, [file, content, imports, exports]];
	}
	function moveOneIn(content) {
	    const lines = content.split(os.EOL);
	    let c = "";
	    lines.forEach(value => c += "\t" + value + os.EOL);
	    return c;
	}
	
	__export["tsb/17"] = {};
	__export["tsb/17"].overwriteFiles = overwriteFiles;
	__export["tsb/17"].overwriteFile = overwriteFile;
	__export["tsb/17"].moveOneIn = moveOneIn;
});
// M:\langs\bun\tsb-new\build\src\helper.js
bundler.define("tsb/16", ["tsb/18"], async (__export, __import) => {
	const load_resources = __import["tsb/18"].load_resources;
	const R = __import["tsb/18"].R;
	const fs = require("fs");
	const path = require("path");
	
	
	
	function createTSConfig(cwd) {
	    fs.writeFileSync(path.join(cwd, "tsconfig.json"), load_resources(R.templates.ts_config_json));
	}
	function getWrapper() {
	    return load_resources(R.wrapper.bundler_js);
	}
	function getResourcesWrapper() {
	    return load_resources(R.wrapper.res_ts);
	}
	class SymbolTable {
	    constructor(config) {
	        this.files = new Map();
	        this.config = config;
	    }
	    load(file, libCompilation, config) {
	        if (this.files.has(file)) {
	            return this.files.get(file);
	        }
	        this.files.set(file, (!this.isLib(file) && libCompilation ? config.version + "/" : "") + this.config.name + "/" + this.files.size);
	        return this.load(file, libCompilation, config);
	    }
	    set(file, value) {
	        this.files.set(file, value);
	    }
	    isLib(file) {
	        return file.startsWith("@yapm");
	    }
	}
	
	__export["tsb/16"] = {};
	__export["tsb/16"].createTSConfig = createTSConfig;
	__export["tsb/16"].getWrapper = getWrapper;
	__export["tsb/16"].getResourcesWrapper = getResourcesWrapper;
	__export["tsb/16"].SymbolTable = SymbolTable;
});
// M:\langs\bun\tsb-new\build\src\resources.js
bundler.define("tsb/18", [], async (__export, __import) => {
	const data = new Map();
	function load_resources(id) {
	    if (data.has(id.id)) {
	        return atob(data.get(id.id));
	    }
	    throw "Resources not declared";
	}
	function has_resources(id) {
	    return data.has(id.id);
	}
	const R = {
	    templates: {
	        ts_config_json: {
	            id: 0
	        }
	    },
	    wrapper: {
	        bundler_js: {
	            id: 1
	        },
	        res_ts: {
	            id: 2
	        }
	    }
	};
	data.set(R.templates.ts_config_json.id, "ew0KICAiY29tcGlsZXJPcHRpb25zIjogew0KICAgICJ0YXJnZXQiOiAiZXMyMDIwIiwNCiAgICAibW9kdWxlIjogImVzMjAyMCIsDQogICAgIm1vZHVsZVJlc29sdXRpb24iOiAibm9kZSIsDQogICAgImRlY2xhcmF0aW9uIjogdHJ1ZSwNCiAgICAicmVtb3ZlQ29tbWVudHMiOiB0cnVlLA0KICAgICJvdXREaXIiOiAiYnVpbGQvc3JjIiwNCiAgICAiZGVjbGFyYXRpb25EaXIiOiAiYnVpbGQvaGVhZGVyIiwNCiAgICAicGF0aHMiOiB7DQogICAgICAiQHlhcG0vKiI6IFsiLi9saWIvKiJdDQogICAgfQ0KDQogIH0sDQogICJleGNsdWRlIjogWw0KICAgICJsaWIiLA0KICAgICJhc3NldHMiLA0KICAgICJub2RlX21vZHVsZXMiDQogIF0NCn0=");
	data.set(R.wrapper.bundler_js.id, "InVzZSBzdHJpY3QiOw0KDQpjbGFzcyBUU0J1bmRsZXIgew0KICAgIGNvbnN0cnVjdG9yKCkgew0KICAgICAgICB0aGlzLmxvYWRlZCA9IG5ldyBNYXAoKTsNCiAgICAgICAgdGhpcy5tb2R1bGVzID0gbmV3IE1hcCgpOw0KICAgICAgICB0aGlzLmF1dG9sb2FkID0gW107DQogICAgfQ0KDQogICAgZGVmaW5lKG5hbWUsIGltcG9ydHMsIGNiKSB7DQogICAgICAgIHRoaXMubW9kdWxlcy5zZXQobmFtZSwgew0KICAgICAgICAgICAgaW1wb3J0czogaW1wb3J0cywNCiAgICAgICAgICAgIGNiOiBjYg0KICAgICAgICB9KTsNCiAgICB9DQoNCiAgICBsb2FkKG5hbWUpIHsNCiAgICAgICAgdGhpcy5hdXRvbG9hZC5wdXNoKG5hbWUpOw0KICAgIH0NCg0KICAgIGFzeW5jIHN0YXJ0KCkgew0KICAgICAgICBmb3IgKGNvbnN0IGxvYWQgb2YgdGhpcy5hdXRvbG9hZCkgew0KICAgICAgICAgICAgYXdhaXQgdGhpcy5sb2FkUGFja2FnZShsb2FkKTsNCiAgICAgICAgfQ0KICAgIH0NCg0KICAgIGFzeW5jIGxvYWRQYWNrYWdlKG5hbWUpIHsNCiAgICAgICAgaWYgKHRoaXMubW9kdWxlcy5oYXMobmFtZSkpIHsNCiAgICAgICAgICAgIGlmICh0aGlzLmxvYWRlZC5oYXMobmFtZSkpIHsNCiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkZWQuZ2V0KG5hbWUpOw0KICAgICAgICAgICAgfQ0KICAgICAgICAgICAgbGV0IG1vZCA9IHRoaXMubW9kdWxlcy5nZXQobmFtZSk7DQogICAgICAgICAgICBpZiAobW9kID09IHVuZGVmaW5lZCkgew0KICAgICAgICAgICAgICAgIHJldHVybiB7fTsNCiAgICAgICAgICAgIH0NCiAgICAgICAgICAgIGxldCBfX2ltcG9ydCA9IHt9Ow0KICAgICAgICAgICAgZm9yIChjb25zdCByZXEgb2YgbW9kLmltcG9ydHMpIHsNCiAgICAgICAgICAgICAgICBsZXQgcmVxSW1wb3J0ID0gYXdhaXQgdGhpcy5sb2FkUGFja2FnZShyZXEpOw0KICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlcUltcG9ydCkuZm9yRWFjaCgodmFsdWUpID0+IHsNCiAgICAgICAgICAgICAgICAgICAgX19pbXBvcnRbdmFsdWVdID0gcmVxSW1wb3J0W3ZhbHVlXTsNCiAgICAgICAgICAgICAgICB9KTsNCiAgICAgICAgICAgIH0NCiAgICAgICAgICAgIGxldCBfX2V4cG9ydCA9IHt9Ow0KICAgICAgICAgICAgYXdhaXQgbW9kLmNiKF9fZXhwb3J0LCBfX2ltcG9ydCk7DQogICAgICAgICAgICB0aGlzLmxvYWRlZC5zZXQobmFtZSwgX19leHBvcnQpOw0KICAgICAgICAgICAgcmV0dXJuIF9fZXhwb3J0Ow0KICAgICAgICB9IGVsc2Ugew0KICAgICAgICAgICAgdGhyb3cgIk5vIHBhY2thZ2Ugd2l0aCB0aGUgaWQgXCIiICsgbmFtZSArICJcIiBkZWZpbmVkIjsNCiAgICAgICAgfQ0KICAgIH0NCn0NCg0KY29uc3QgYnVuZGxlciA9IG5ldyBUU0J1bmRsZXIoKTsNCg==");
	data.set(R.wrapper.res_ts.id, "dHlwZSBSZXNvdXJjZXNJRCA9IHsNCiAgICBpZDogbnVtYmVyOw0KfQ0KDQpjb25zdCBkYXRhOiBNYXA8bnVtYmVyLCBzdHJpbmc+ID0gbmV3IE1hcDxudW1iZXIsIHN0cmluZz4oKTsNCg0KZXhwb3J0IGZ1bmN0aW9uIGxvYWRfcmVzb3VyY2VzKGlkOiBSZXNvdXJjZXNJRCk6IHN0cmluZyB7DQogICAgaWYgKGRhdGEuaGFzKGlkLmlkKSkgew0KICAgICAgICByZXR1cm4gYXRvYig8c3RyaW5nPmRhdGEuZ2V0KGlkLmlkKSk7DQogICAgfQ0KICAgIHRocm93ICJSZXNvdXJjZXMgbm90IGRlY2xhcmVkIjsNCn0NCg0KZXhwb3J0IGZ1bmN0aW9uIGhhc19yZXNvdXJjZXMoaWQ6IFJlc291cmNlc0lEKTogYm9vbGVhbiB7DQogICAgcmV0dXJuIGRhdGEuaGFzKGlkLmlkKTsNCn0NCg0K");
	
	__export["tsb/18"] = {};
	__export["tsb/18"].load_resources = load_resources;
	__export["tsb/18"].has_resources = has_resources;
	__export["tsb/18"].R = R;
});
// M:\langs\bun\tsb-new\build\src\utils.js
bundler.define("tsb/15", [], async (__export, __import) => {
	const cwd = process.cwd();
	
	__export["tsb/15"] = {};
	__export["tsb/15"].cwd = cwd;
});
// Entry point call
bundler.load("tsb/14");
bundler.start();