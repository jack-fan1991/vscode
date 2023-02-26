"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticsErrorCodeHandler = void 0;
const vscode = require("vscode");
// 提供對應診斷問題的代碼操作。
class DiagnosticsErrorCodeHandler {
    DiagnosticsErrorCodeHandler(providers) {
        this.providers = providers;
    }
    /**
     * 為每個具有匹配 "code" 的診斷條目創建代碼操作命令
     * @param document 代碼所在的文檔
     * @param range 代碼選中的範圍
     * @param context 代碼操作上下文
     * @param token 執行代碼操作的令牌
     * 依照發出的 diagnostic.code 轉發成codeAction
     */
    provideCodeActions(document, range, context, token) {
        let fixAction = [];
        context.diagnostics
            .forEach(diagnostic => {
            var _a;
            return (_a = this.providers) === null || _a === void 0 ? void 0 : _a.forEach((provider) => {
                let action = provider.handleError(diagnostic, document, range);
                if (action != null) {
                    fixAction.push(action);
                }
            });
        });
        return fixAction;
    }
}
exports.DiagnosticsErrorCodeHandler = DiagnosticsErrorCodeHandler;
DiagnosticsErrorCodeHandler.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
//# sourceMappingURL=diagnostics_error_code_handler.js.map