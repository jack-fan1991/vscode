"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshDiagnostics = exports.subscribeToDocumentChanges = void 0;
const vscode = require("vscode");
let diagnostics = [];
/**
 * 訂閱文檔變更事件
 * @param context 上下文
 * @param diagnostics 問題診斷集合
 */
function subscribeToDocumentChanges(context, diagnostics, providers) {
    if (vscode.window.activeTextEditor) {
        refreshDiagnostics(vscode.window.activeTextEditor.document, diagnostics, providers);
    }
    // 監聽文件開啟
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            refreshDiagnostics(editor.document, diagnostics, providers);
        }
    }));
    // 監聽文件變化
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, diagnostics, providers)));
    // 監聽文件關閉移除文檔中的錯物事件
    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(doc => diagnostics.delete(doc.uri)));
}
exports.subscribeToDocumentChanges = subscribeToDocumentChanges;
/**
 * 分析文本文件並尋找問題。
 * 處理變化所要發送的事件。
 * @param document 要分析的文本文件
 * @param partFixDiagnostics 問題診斷集合
 */
function refreshDiagnostics(document, partFixDiagnostics, providers) {
    for (let p of providers) {
        diagnostics = [...diagnostics, ...p.handleAllFile(document, diagnostics)];
    }
    partFixDiagnostics.set(document.uri, diagnostics);
}
exports.refreshDiagnostics = refreshDiagnostics;
//# sourceMappingURL=diagnostics.js.map