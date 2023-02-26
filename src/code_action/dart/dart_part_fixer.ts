import path = require('path');
import * as vscode from 'vscode';
import * as fs from 'fs';
import { title } from 'process';
import { openEditor } from '../../utils/common';
import { CodeActionProviderInterface } from '../code_action';
import { StatusCode } from '../error_code';

export class PartFixInfo {
    targetAbsPath: string;
    shortPath: string;
    title: string;
    msg: string;
    importLine: string;
    constructor(targetAbsPath: string, shortPath: string, title: string, msg: string, importLine: string) {
        this.targetAbsPath = targetAbsPath;
        this.shortPath = shortPath;
        this.title = title
        this.msg = msg;
        this.importLine = importLine;

    }
}
export class DartPartFixer implements CodeActionProviderInterface<PartFixInfo> {

    public static readonly command = 'DartPartFixer.command';
    public static partLineRegex = new RegExp(/^part.*[;'"]$/)
    getCommand() { return DartPartFixer.command }
    getProvidedCodeActionKinds() { return [vscode.CodeActionKind.QuickFix]; }
    getErrorCode() { return StatusCode.MissingDartPart }
    getLangrageType() { return 'dart' }

    createFixAction(document: vscode.TextDocument, range: vscode.Range, data: PartFixInfo): vscode.CodeAction {
        const fix = new vscode.CodeAction(`${data.msg}`, vscode.CodeActionKind.QuickFix);
        fix.command = { command: DartPartFixer.command, title: data.title, arguments: [document, range, data.targetAbsPath, data.importLine] };
        fix.diagnostics = [this.createDiagnostic(range, data)];
        fix.isPreferred = true;
        return fix;
    }
    //建立錯誤顯示文字hover
    createDiagnostic(range: vscode.Range, data: PartFixInfo): vscode.Diagnostic {
        const diagnostic = new vscode.Diagnostic(range, `${data.shortPath} \n需要引入 ${data.importLine}`, vscode.DiagnosticSeverity.Error);
        diagnostic.source = `\nlazy-jack \nFix import ${data.importLine} in ${data.shortPath};`;
        diagnostic.code = this.getErrorCode()
        return diagnostic
    }
    // 註冊action 按下後的行為
    setOnActionCommandCallback(context: vscode.ExtensionContext) {
        // 注册 Quick Fix 命令
        context.subscriptions.push(vscode.commands.registerCommand(DartPartFixer.command, async (document: vscode.TextDocument, range: vscode.Range, targetPath: string, importText: string) => {
            // quick fix 點選的行
            // let lineNumber: number = range.start.line
            // let partLine = document.lineAt(lineNumber).text;

            let textEditor = await openEditor(targetPath)
            if (textEditor) {
                let lastPartLine = 0
                let lines = document.getText().split(/\r?\n/)
                for (let l of lines) {
                    lastPartLine++
                    if (l.includes('part')) {
                        break
                    }
                }
                await textEditor.edit((editBuilder) => {
                    editBuilder.insert(new vscode.Position(importText.includes('of') ? 0 : lastPartLine, 0), importText + '\n');
                })
            }
        }));
    }

    handleAllFile(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]): vscode.Diagnostic[] {

        let lines = document.getText().split(/\r?\n/)
        for (let line of lines) {
            if (DartPartFixer.partLineRegex.exec(line) != null) {
                let range = new vscode.Range(new vscode.Position(lines.indexOf(line), 0), new vscode.Position(lines.indexOf(line), 0))
                let partFixInfo = this.handleLine(document, range)
                if (!partFixInfo) return diagnostics
                diagnostics.push(this.createDiagnostic(range, partFixInfo))
            }
        }
        return diagnostics
    }
    handleLine(document: vscode.TextDocument, range: vscode.Range): PartFixInfo | undefined {
        let partLine = document.lineAt(range.start.line).text;
        let pathRegExp = new RegExp(/'(\.\/)+(.+?)'/);
        let includeOf = partLine.includes('of');
        if (includeOf) {
            pathRegExp = new RegExp(/'(\.\.\/)+(.+?)'/);
        }
        let match = partLine.match(pathRegExp);
        if (match) {
            partLine = match[0].replace(/'/g, '').replace(/"/g, '');
        }
        let currentDir = path.dirname(document.fileName);
        let currentFileName = path.basename(document.fileName);
        let targetAbsPath = path.resolve(currentDir, partLine);
        let targetDir = path.dirname(targetAbsPath);
        let targetFileName = path.basename(targetAbsPath);

        if (!fs.existsSync(targetAbsPath)) {
            console.log(`!!!!!${targetAbsPath} NotFound!!!!!!`);
            return;
        }
        const targetFileContent = fs.readFileSync(targetAbsPath, 'utf-8').replace(/\s/g, '');
        let keyPoint = includeOf ? 'part' : 'part of';
        let targetImportPartOfName = "";
        targetImportPartOfName = path.join(path.relative(targetDir, currentDir), currentFileName);
        if (includeOf || targetImportPartOfName.split('/').length === 1) {
            targetImportPartOfName = `./${targetImportPartOfName}`;
        }
        let importLine = `${keyPoint} '${targetImportPartOfName}';`;
        if (targetFileContent.includes(importLine.replace(/\s/g, ''))) {
            console.log(`${importLine} already in ${targetAbsPath}`);
            return;
        }
        let shortPath = targetAbsPath.replace(currentDir, '.');
        let msg = `Add line "${importLine}" to "${shortPath}"`;
        let title = `Fix import in ${shortPath}`
        return new PartFixInfo(targetAbsPath, shortPath, title, msg, importLine);
    }

    // 檢查是否為part 開頭 '"; 結尾
    isPartLine(document: vscode.TextDocument, range: vscode.Range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        return DartPartFixer.partLineRegex.exec(line.text) != null;
    }
    // 編輯時對單行檢測
    public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] | undefined {
        if (!this.isPartLine(document, range)) {
            return;
        }
        let partFixInfo = this.handleLine(document, range);
        if (partFixInfo == null)
            return;
        const quickFixPart = this.createFixAction(document, range, partFixInfo);
        const diagnostic = new vscode.Diagnostic(range, `${partFixInfo.shortPath} \n需要引入 ${partFixInfo.importLine}`, vscode.DiagnosticSeverity.Error);
        diagnostic.source = '\nlazy-jack \nFix import ${partFixInfo.importLine} in ${partFixInfo.shortPath};';
        // 將所有程式碼動作打包成陣列，並回傳
        return [quickFixPart];
    }

    handleError(diagnostic: vscode.Diagnostic, document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction | undefined {
        if (diagnostic.code != this.getErrorCode()) return
        let partFixInfo = this.handleLine(document, range);
        if (partFixInfo == null) return
        return this.createFixAction(document, range, partFixInfo)
    }

}
