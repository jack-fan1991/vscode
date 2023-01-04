"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onTreeItemSelect = exports.VscodeExtensionTreeDataProvider = exports.NpmTreeDataProvider = exports.RunBuilderTreeDataProvider = exports.FlutterTreeDataProvider = exports.SideBarEntryItem = exports.sidebar_command = void 0;
const vscode = require("vscode");
const common_1 = require("./utils/common");
const terminal_util = require("./utils/terminal_utils");
var ScriptsType;
(function (ScriptsType) {
    ScriptsType["terminal"] = "terminal";
})(ScriptsType || (ScriptsType = {}));
exports.sidebar_command = "sidebar_command.onSelected";
const flutterScripts = [
    {
        scriptsType: ScriptsType.terminal,
        label: 'flutter pub get',
        script: 'flutter pub get',
    }
];
const buildRunnerScripts = [
    {
        scriptsType: ScriptsType.terminal,
        label: "build_runner build",
        script: 'flutter pub run build_runner build',
    },
    {
        scriptsType: ScriptsType.terminal,
        label: "build_runner delete build ",
        script: 'flutter pub run build_runner build --delete-conflicting-outputs',
    },
];
const npmScripts = [
    {
        scriptsType: ScriptsType.terminal,
        label: "npm run build",
        script: 'npm run build',
    },
];
const vsceScripts = [
    {
        scriptsType: ScriptsType.terminal,
        label: "vs code extension publish",
        script: 'vsce publish',
    },
];
const gitScripts = [
    {
        scriptsType: ScriptsType.terminal,
        label: "git force push",
        script: 'git push -f origin',
    },
    {
        scriptsType: ScriptsType.terminal,
        label: "git reflog",
        script: 'git reflog',
    }
];
// 树节点
/**
 * @description 重写每个节点
 */
class SideBarEntryItem extends vscode.TreeItem {
    constructor(version, label, collapsibleState) {
        super(label, collapsibleState);
        this.version = version;
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.tooltip = `${this.label}-${this.version}`;
        // this.description = `${this.version}-${Math.ceil(Math.random() * 1000)}`
    }
}
exports.SideBarEntryItem = SideBarEntryItem;
class FlutterTreeDataProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        var _a, _b;
        //子节点
        let childrenList = [];
        let script = flutterScripts;
        for (let index = 0; index < script.length; index++) {
            let item = new SideBarEntryItem('1.0.0', (_a = script[index].label) !== null && _a !== void 0 ? _a : script[index].script, vscode.TreeItemCollapsibleState.None);
            item.command = {
                command: exports.sidebar_command,
                title: (_b = "run" + script[index].label + "on" + script[index].scriptsType) !== null && _b !== void 0 ? _b : "showInformationMessage",
                arguments: [script[index]], //命令接收的参数
            };
            childrenList[index] = item;
        }
        return Promise.resolve((0, common_1.onFlutter)(() => childrenList, () => []));
    }
}
exports.FlutterTreeDataProvider = FlutterTreeDataProvider;
class RunBuilderTreeDataProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        var _a, _b;
        //子节点
        let childrenList = [];
        let script = buildRunnerScripts;
        for (let index = 0; index < script.length; index++) {
            let item = new SideBarEntryItem('1.0.0', (_a = script[index].label) !== null && _a !== void 0 ? _a : script[index].script, vscode.TreeItemCollapsibleState.None);
            item.command = {
                command: exports.sidebar_command,
                title: (_b = "run" + script[index].label + "on" + script[index].scriptsType) !== null && _b !== void 0 ? _b : "showInformationMessage",
                arguments: [script[index]], //命令接收的参数
            };
            childrenList[index] = item;
        }
        return Promise.resolve((0, common_1.onFlutter)(() => childrenList, () => []));
    }
}
exports.RunBuilderTreeDataProvider = RunBuilderTreeDataProvider;
class NpmTreeDataProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        var _a, _b;
        //子节点
        let childrenList = [];
        let script = npmScripts;
        for (let index = 0; index < script.length; index++) {
            let item = new SideBarEntryItem('1.0.0', (_a = script[index].label) !== null && _a !== void 0 ? _a : script[index].script, vscode.TreeItemCollapsibleState.None);
            item.command = {
                command: exports.sidebar_command,
                title: (_b = "run" + script[index].label + "on" + script[index].scriptsType) !== null && _b !== void 0 ? _b : "showInformationMessage",
                arguments: [script[index]], //命令接收的参数
            };
            childrenList[index] = item;
        }
        return Promise.resolve((0, common_1.onTypeScript)(() => childrenList, () => []));
    }
}
exports.NpmTreeDataProvider = NpmTreeDataProvider;
class VscodeExtensionTreeDataProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        var _a, _b;
        //子节点
        let childrenList = [];
        let script = vsceScripts;
        for (let index = 0; index < script.length; index++) {
            let item = new SideBarEntryItem('1.0.0', (_a = script[index].label) !== null && _a !== void 0 ? _a : script[index].script, vscode.TreeItemCollapsibleState.None);
            item.command = {
                command: exports.sidebar_command,
                title: (_b = "run" + script[index].label + "on" + script[index].scriptsType) !== null && _b !== void 0 ? _b : "showInformationMessage",
                arguments: [script[index]], //命令接收的参数
            };
            childrenList[index] = item;
        }
        return Promise.resolve((0, common_1.onTypeScript)(() => childrenList, () => []));
    }
}
exports.VscodeExtensionTreeDataProvider = VscodeExtensionTreeDataProvider;
function onTreeItemSelect(context, args) {
    console.log('[flutter-lazy-cmd] 選擇:', args);
    let scriptsType = args["scriptsType"];
    let script = args["script"];
    if (scriptsType == null) {
        vscode.window.showInformationMessage("No match key 'scriptsType' Only show => " + script);
        return;
    }
    switch (scriptsType) {
        case ScriptsType.terminal:
            terminalAction(context, script);
            break;
        default:
            vscode.window.showInformationMessage("Only show => " + script);
    }
}
exports.onTreeItemSelect = onTreeItemSelect;
function terminalAction(context, command) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('[terminalAction] 選擇:', command);
        if (command.includes("push -f")) {
            const cwd = vscode.workspace.rootPath;
            let branch = yield terminal_util.runCommand("cd " + cwd + " && git rev-parse --abbrev-ref HEAD");
            let gitCommand = command + " " + branch;
            (0, common_1.showInfo2OptionMessage)("你確定要執行 " + gitCommand, undefined, undefined, () => (terminal_util.runTerminal(context, gitCommand)));
            return;
        }
        (0, common_1.showInfo2OptionMessage)("你確定要執行 " + command, undefined, undefined, () => (terminal_util.runTerminal(context, command)));
    });
}
//# sourceMappingURL=sidebar.js.map