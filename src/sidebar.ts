import * as vscode from 'vscode';
import { showInfo2OptionMessage, onFlutter, onGit, onTypeScript } from './utils/common';
import * as terminal_util from './utils/terminal_utils';

enum ScriptsType {
    terminal = 'terminal',
}
export const sidebar_command = "sidebar_command.onSelected";


const flutterScripts = [
    {
        scriptsType: ScriptsType.terminal,
        label: 'flutter pub get',
        script: 'flutter pub get',
    }
]

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
]

const npmScripts = [
    {
        scriptsType: ScriptsType.terminal,
        label: "npm run build",
        script: 'npm run build',
    },
]

const vsceScripts = [
    {
        scriptsType: ScriptsType.terminal,
        label: "vs code extension publish",
        script: 'vsce publish',
    },
]

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
]



// 树节点
/**
 * @description 重写每个节点
 */
export class SideBarEntryItem extends vscode.TreeItem {
    constructor(
        private version: string,
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState)
        this.tooltip = `${this.label}-${this.version}`
        // this.description = `${this.version}-${Math.ceil(Math.random() * 1000)}`
    }
}


export class FlutterTreeDataProvider implements vscode.TreeDataProvider<SideBarEntryItem> {

    constructor(private workspaceRoot?: string) { }
    getTreeItem(element: SideBarEntryItem): vscode.TreeItem {
        return element
    }
    getChildren(
        element?: SideBarEntryItem
    ): vscode.ProviderResult<SideBarEntryItem[]> {
        //子节点
        let childrenList: any[] = []
        let script = flutterScripts
        for (let index = 0; index < script.length; index++) {
            let item = new SideBarEntryItem(
                '1.0.0',
                script[index].label ?? script[index].script,
                vscode.TreeItemCollapsibleState.None
            )
            item.command = {
                command: sidebar_command, //命令id
                title: "run" + script[index].label + "on" + script[index].scriptsType ?? "showInformationMessage",
                arguments: [script[index]], //命令接收的参数
            }
            childrenList[index] = item
        }
        return Promise.resolve(onFlutter(() => childrenList, () => []));
    }

}


export class RunBuilderTreeDataProvider implements vscode.TreeDataProvider<SideBarEntryItem> {

    constructor(private workspaceRoot?: string) { }
    getTreeItem(element: SideBarEntryItem): vscode.TreeItem {
        return element
    }
    getChildren(
        element?: SideBarEntryItem
    ): vscode.ProviderResult<SideBarEntryItem[]> {

        //子节点
        let childrenList: any[] = []
        let script = buildRunnerScripts
        for (let index = 0; index < script.length; index++) {
            let item = new SideBarEntryItem(
                '1.0.0',
                script[index].label ?? script[index].script,
                vscode.TreeItemCollapsibleState.None
            )
            item.command = {
                command: sidebar_command, //命令id
                title: "run" + script[index].label + "on" + script[index].scriptsType ?? "showInformationMessage",
                arguments: [script[index]], //命令接收的参数
            }
            childrenList[index] = item
        }
        return Promise.resolve(onFlutter(() => childrenList, () => []));
    }

}
export class NpmTreeDataProvider implements vscode.TreeDataProvider<SideBarEntryItem> {

    constructor(private workspaceRoot?: string) { }
    getTreeItem(element: SideBarEntryItem): vscode.TreeItem {
        return element
    }
    getChildren(
        element?: SideBarEntryItem
    ): vscode.ProviderResult<SideBarEntryItem[]> {

        //子节点
        let childrenList: any[] = []
        let script = npmScripts
        for (let index = 0; index < script.length; index++) {
            let item = new SideBarEntryItem(
                '1.0.0',
                script[index].label ?? script[index].script,
                vscode.TreeItemCollapsibleState.None
            )
            item.command = {
                command: sidebar_command, //命令id
                title: "run" + script[index].label + "on" + script[index].scriptsType ?? "showInformationMessage",
                arguments: [script[index]], //命令接收的参数
            }
            childrenList[index] = item
        }
        return Promise.resolve(onTypeScript(() => childrenList, () => []));
    }

}
export class VscodeExtensionTreeDataProvider implements vscode.TreeDataProvider<SideBarEntryItem> {

    constructor(private workspaceRoot?: string) { }
    getTreeItem(element: SideBarEntryItem): vscode.TreeItem {
        return element
    }
    getChildren(
        element?: SideBarEntryItem
    ): vscode.ProviderResult<SideBarEntryItem[]> {
        //子节点
        let childrenList: any[] = []
        let script = vsceScripts
        for (let index = 0; index < script.length; index++) {
            let item = new SideBarEntryItem(
                '1.0.0',
                script[index].label ?? script[index].script,
                vscode.TreeItemCollapsibleState.None
            )
            item.command = {
                command: sidebar_command, //命令id
                title: "run" + script[index].label + "on" + script[index].scriptsType ?? "showInformationMessage",
                arguments: [script[index]], //命令接收的参数
            }
            childrenList[index] = item
        }
        return Promise.resolve(onTypeScript(() => childrenList, () => []));
    }

}

export function onTreeItemSelect(context: vscode.ExtensionContext, args: any) {
    console.log('[flutter-lazy-cmd] 選擇:', args)
    let scriptsType = args["scriptsType"];
    let script = args["script"];
    if (scriptsType == null) {
        vscode.window.showInformationMessage("No match key 'scriptsType' Only show => " + script)
        return
    }
    switch (scriptsType) {
        case ScriptsType.terminal:
            terminalAction(context, script)
            break;
        default:
            vscode.window.showInformationMessage("Only show => " + script)
    }
}

async function terminalAction(context: vscode.ExtensionContext, command: string) {
    console.log('[terminalAction] 選擇:', command)
    if (command.includes("push -f")) {
        const cwd = vscode.workspace.rootPath;
        let branch = await terminal_util.runCommand("cd " + cwd + " && git rev-parse --abbrev-ref HEAD")
        let gitCommand = command + " " + branch
        showInfo2OptionMessage("你確定要執行 " + gitCommand, undefined, undefined, () => (
            terminal_util.runTerminal(context, gitCommand))
        );
        return;
    }
    showInfo2OptionMessage("你確定要執行 " + command, undefined, undefined, () => (
        terminal_util.runTerminal(context, command))
    );
}


