import * as vscode from 'vscode'
import { registerDartSnippet } from './utils/snippet_utils';
import { registerGenerateGetterSetter } from './dart/generate getter_setter';
import { registerFastGithubCmd } from './github/fast_cmd';
import * as sidebar from './sidebar';

export function activate(context: vscode.ExtensionContext) {
  console.log('your extension "sugar-demo-vscode" is now active!')
  registerDartSnippet(context)
  registerGenerateGetterSetter(context)
  registerFastGithubCmd(context)
  //註冊 views id
  vscode.window.registerTreeDataProvider("flutter-lazy-cmd", new sidebar.FlutterTreeDataProvider());
  vscode.window.registerTreeDataProvider("build_runner-lazy-cmd", new sidebar.RunBuilderTreeDataProvider());
  vscode.window.registerTreeDataProvider("npm-lazy-cmd", new sidebar.NpmTreeDataProvider());
  vscode.window.registerTreeDataProvider("vscode-extension-lazy-cmd", new sidebar.VscodeExtensionTreeDataProvider());
  //註冊命令回調
  vscode.commands.registerCommand(sidebar.sidebar_command, (args) => {
    sidebar.onTreeItemSelect(context, args)
  })
}

export function deactivate() { }
