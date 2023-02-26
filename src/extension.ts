import * as vscode from 'vscode'
import { registerDartSnippet } from './utils/snippet_utils';
import {  registerGenerateGetterSetter, registerFreezedToJson, registerToRequireParams, registerJsonToFreezed, registerCommandDartSelectedToFactory, registerGenerateAssert } from './dart/dart';
import { registerFastGithubCmd } from './github/github_utils';
import * as sidebar from './sidebar';
import * as codeAction from './code_action/code_action';

export function activate(context: vscode.ExtensionContext) {
  console.log('your extension "sugar-demo-vscode" is now active!')
  registerDartSnippet(context)
  registerGenerateGetterSetter(context)
  registerFastGithubCmd(context)
  registerToRequireParams(context)
  registerFreezedToJson(context)
  registerJsonToFreezed(context)
  registerCommandDartSelectedToFactory(context)
  registerGenerateAssert(context)
  codeAction.register(context)


  //註冊 views id
  vscode.window.registerTreeDataProvider("flutter-lazy-cmd", new sidebar.FlutterTreeDataProvider());
  vscode.window.registerTreeDataProvider("build_runner-lazy-cmd", new sidebar.RunBuilderTreeDataProvider());
  vscode.window.registerTreeDataProvider("git-lazy-cmd", new sidebar.GitTreeDataProvider());
  vscode.window.registerTreeDataProvider("npm-lazy-cmd", new sidebar.NpmTreeDataProvider());
  vscode.window.registerTreeDataProvider("vscode-extension-lazy-cmd", new sidebar.VscodeExtensionTreeDataProvider());
  //註冊命令回調
  vscode.commands.registerCommand(sidebar.sidebar_command, (args) => {
    sidebar.onTreeItemSelect(context, args)
  })
}

export function deactivate() { }
