import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';


export function showInfo2OptionMessage(msg: string, option1?: string, option2?: string, onOption1?: () => void) {
  vscode.window.showInformationMessage(msg, option1 ?? '執行', option2 ?? '取消').then((selectedOption) => {
    if (onOption1 == null) return;
    if (selectedOption === '執行') {
      onOption1();
    } else if (selectedOption === '取消') {
      // 取消相應的操作
    }
  });
}



export async function onFlutter(getData: (data: any) => any, errorData: () => any, returnData: boolean = false) {
  if (vscode.workspace.rootPath == undefined) {
    return
  }

  let absPath = path.join(vscode.workspace.rootPath, 'pubspec.yaml');
  let filePath = '**/pubspec.yaml';
  let data;
  const files = await vscode.workspace.findFiles(filePath);
  if (files.length <= 0) {
    console.log('當前不是flutter 專案');
    return errorData()
  }
  if (returnData) {
    data = await readFile(absPath)
  }
  return getData(data)
}

export async function onGit(getData: () => any[], errorData: () => any[]) {
  const files = await vscode.workspace.findFiles('**/.gitignore', '**/android/**', 1);
  if (files.length <= 0) {
    console.log('當前不是 git 專案');
    return errorData()

  }
  return getData()
}

function readFile(absPath: string): any {
  if (fs.existsSync(absPath)) {
    vscode.window.showInformationMessage(`正在解析 ${absPath}`, '關閉')
    const fileContents = fs.readFileSync(absPath, 'utf-8');
    return yaml.parse(fileContents);
  } else {
    console.error(`The file ${absPath} does not exist.`);
  }
}

export async function onTypeScript(getData: (data: any) => any, errorData: () => any, returnData: boolean = false) {
  if (vscode.workspace.rootPath == undefined) {
    return
  }
  let absPath = path.join(vscode.workspace.rootPath, 'package.json');
  let filePath = '**/package.json';
  let data;
  const files = await vscode.workspace.findFiles(filePath);
  if (files.length <= 0) {
    console.log('當前不是TypeScript 專案');
    return errorData()
  }
  if (returnData) {
    data = await readFile(absPath)
  }
  return getData(data)

}

export function showPicker(placeholder: string, items: any, onItemSelect: (item: any) => void) {
  let quickPick = vscode.window.createQuickPick();
  quickPick.placeholder = placeholder
  quickPick.items = items;
  quickPick.onDidAccept(() => onItemSelect(quickPick.selectedItems[0]));
  quickPick.show()
}

export async function openEditor(filePath: string): Promise<vscode.TextEditor | undefined> {
  if(!fs.existsSync(filePath))return
  let editor = vscode.window.visibleTextEditors.find(e => e.document.fileName === filePath)
  if (!editor) {
    await vscode.workspace.openTextDocument(filePath).then(async (document) =>
      editor = await vscode.window.showTextDocument(document, vscode.ViewColumn.Beside, false).then(editor => editor))
  }
  return editor
}

export async function replaceText(filePath: string, searchValue: string, replaceValue: string): Promise<boolean> {
  // find yaml editor
  let editor = vscode.window.visibleTextEditors.find(e => e.document.fileName === filePath)
  if (!editor) {
    await vscode.workspace.openTextDocument(filePath).then(async (document) =>
      editor = await vscode.window.showTextDocument(document, vscode.ViewColumn.Beside, false).then(editor => editor))
  }
  if (!editor) {
    return false
  }
  // 修改yaml 中的 version
  const document = editor.document;
  const start = new vscode.Position(0, 0);
  const end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
  const textRange = new vscode.Range(start, end);
  const text = document.getText();
  const startIndex = text.indexOf(searchValue);
  if (startIndex !== -1) {
    const endIndex = startIndex + searchValue.length;
    const range = new vscode.Range(document.positionAt(startIndex), document.positionAt(endIndex));
    await editor.edit((editBuilder) => {
      editBuilder.replace(range, replaceValue);
    });

    editor.document.save()
    return true
  }
  else {
    vscode.window.showErrorMessage(`filePath 中找不到${replaceValue}`)
    return false

  }
}
