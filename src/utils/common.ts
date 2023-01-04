import * as vscode from 'vscode';


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



export async function onFlutter(getData: () => any[], errorData: () => any[]) {
  const files = await vscode.workspace.findFiles('**/pubspec.yaml');
  if (files.length <= 0) {
    console.log('當前不是flutter 專案');
    return errorData()
  }
  return getData()
}

export async function onGit(getData: () => any[], errorData: () => any[]) {
  const files = await vscode.workspace.findFiles('**/.gitignore', '**/android/**', 1);
  if (files.length <= 0) {
    console.log('當前不是 git 專案');
    return errorData()

  }
  return getData()
}


export async function onTypeScript(getData: () => any[], errorData: () => any[]) {
  const files = await vscode.workspace.findFiles('**/package.json', '**/ios/**');
  if (files.length <= 0) {
    console.log('當前不是TypeScript 專案');
    return errorData()
  }
  return getData()
}


