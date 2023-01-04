"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommand = exports.runTerminal = void 0;
const vscode = require("vscode");
const child_process = require("child_process");
function runTerminal(context, cmd) {
    vscode.window.showInformationMessage('正在執行' + cmd + ' 命令...');
    const terminal = vscode.window.activeTerminal;
    if (!terminal) {
        const newTerminal = vscode.window.createTerminal();
        newTerminal.show();
        newTerminal.sendText(cmd);
        return;
    }
    terminal.show();
    terminal.sendText(cmd);
}
exports.runTerminal = runTerminal;
function runCommand(command) {
    return new Promise((resolve, reject) => {
        child_process.exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(stdout);
            }
        });
    });
}
exports.runCommand = runCommand;
//# sourceMappingURL=terminal_utils.js.map