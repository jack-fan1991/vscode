"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceFolderPath = void 0;
const vscode = require("vscode");
function getWorkspaceFolderPath(currentFilePath) {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(currentFilePath));
    if (workspaceFolder) {
        const workspaceFolderPath = workspaceFolder.uri.fsPath;
        return workspaceFolderPath;
    }
}
exports.getWorkspaceFolderPath = getWorkspaceFolderPath;
// export function getAbsPath(currentFilePath: string,relativePath:string) {
//     const workspaceFolderPath =getWorkspaceFolderPath(currentFilePath);
//     const absolutePath = path.join(workspaceFolderPath??, relativePath);
//     return absolutePath
// }
//# sourceMappingURL=file_utils.js.map