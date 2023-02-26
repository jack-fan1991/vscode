import path = require('path');
import * as vscode from 'vscode';

export function getWorkspaceFolderPath(currentFilePath: string) {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(currentFilePath));
    if (workspaceFolder) {
        const workspaceFolderPath = workspaceFolder.uri.fsPath;
        return workspaceFolderPath
    }
}

// export function getAbsPath(currentFilePath: string,relativePath:string) {
//     const workspaceFolderPath =getWorkspaceFolderPath(currentFilePath);
//     const absolutePath = path.join(workspaceFolderPath??, relativePath);
//     return absolutePath
// }