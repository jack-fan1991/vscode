import path = require('path');
import * as vscode from 'vscode';
import * as fs from 'fs';
import { title } from 'process';
import { openEditor } from '../../utils/common';
import { CodeActionProviderInterface } from '../code_action';
import { StatusCode } from '../error_code';

export class FreezedFixInfo {
    targetAbsPath: string;
    title: string;
    msg: string;
    importLine: string;
    constructor(targetAbsPath: string, title: string, msg: string, importLine: string) {
        this.targetAbsPath = targetAbsPath;
        this.title = title
        this.msg = msg;
        this.importLine = importLine;

    }
}
export class FreezedFixer implements CodeActionProviderInterface<FreezedFixInfo> {

    public static readonly command = 'FreezedFixer.command';
    public static partLineRegex = new RegExp(/^part.*[;'"]$/)
    getCommand() { return FreezedFixer.command }
    getProvidedCodeActionKinds() { return [vscode.CodeActionKind.QuickFix]; }
    getErrorCode() { return StatusCode.MissingFreezedImport }
    getLangrageType() { return 'dart' }

    createFixAction(document: vscode.TextDocument, range: vscode.Range, data: FreezedFixInfo): vscode.CodeAction {
        const fix = new vscode.CodeAction(`${data.msg}`, vscode.CodeActionKind.QuickFix);
        fix.command = { command: FreezedFixer.command, title: data.title, arguments: [document, range, data.targetAbsPath, data.importLine] };
        fix.diagnostics = [this.createDiagnostic(range, data)];
        fix.isPreferred = true;
        return fix;
    }
    //建立錯誤顯示文字hover
    createDiagnostic(range: vscode.Range, data: FreezedFixInfo): vscode.Diagnostic {
        const diagnostic = new vscode.Diagnostic(range, `${data.msg} `, vscode.DiagnosticSeverity.Error);
        diagnostic.code = this.getErrorCode()
        return diagnostic
    }
    // 註冊action 按下後的行為
    setOnActionCommandCallback(context: vscode.ExtensionContext) {
        // 注册 Quick Fix 命令
        context.subscriptions.push(vscode.commands.registerCommand(FreezedFixer.command, async (document: vscode.TextDocument, data: FreezedFixInfo) => {
            // quick fix 點選的行
            // let lineNumber: number = range.start.line
            // let partLine = document.lineAt(lineNumber).text;
            data = document['arguments'][1]
            let textEditor = await openEditor(data.targetAbsPath)
            if (textEditor) {
                let text = textEditor.document.getText()
                let name =path.basename( textEditor.document.uri.path)
                if (data.importLine.includes('part') && !text.includes(`import 'package:freezed_annotation/freezed_annotation.dart';`)) return
                let lastPartLine = 0
                let importFirstChangeIdx = 0
                let lines = text.split(/\r?\n/)
                for (let l of lines) {
                    lastPartLine++
                    let index = lines.indexOf(l)
                    if (importFirstChangeIdx > 0 && !l.includes('import') && !lines[index + 1].includes('import')) {
                        importFirstChangeIdx = lines.indexOf(l)
                    }

                    if (!l.includes('part') && !lines[index + 1].includes('part')) {
                        lastPartLine = lines.indexOf(l)
                    }
                }
                await textEditor.edit((editBuilder) => {
                    editBuilder.insert(new vscode.Position(data.importLine.includes('part') ? importFirstChangeIdx + 1 : importFirstChangeIdx, 0), data.importLine + '\n');
                })
                if (text.includes('@freezed')&&text.includes('.fromJson(')&&!text.includes(`part '${name}.g.dart';`)) {

                    await textEditor.edit((editBuilder) => {
                        editBuilder.insert(new vscode.Position( importFirstChangeIdx + 1 , 0),  `part '${name}.g.dart';\n`);
                    })
                }
            }
        }));
    }

    handleAllFile(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]): vscode.Diagnostic[] {

        let lines = document.getText().split(/\r?\n/)
        for (let line of lines) {
            if (FreezedFixer.partLineRegex.exec(line) != null) {
                let range = new vscode.Range(new vscode.Position(lines.indexOf(line), 0), new vscode.Position(lines.indexOf(line), 0))
                let partFixInfo = this.handleLine(document, range)
                if (!partFixInfo) return diagnostics
                diagnostics.push(this.createDiagnostic(range, partFixInfo))
            }
        }
        return diagnostics
    }
    handleLine(document: vscode.TextDocument, range: vscode.Range): FreezedFixInfo | undefined {
        let partLine = document.lineAt(range.start.line).text
        let baseFileName = path.basename(document.uri.path).replace('.dart', '')
        if (!partLine.includes('@freezed')) return
        let text =document.getText()
        if (text.includes(`import 'package:freezed_annotation/freezed_annotation.dart';`) && text.includes(`part '${baseFileName}.freezed.dart';`)) return
        if (!text.includes(`import 'package:freezed_annotation/freezed_annotation.dart';`)) {
            let data = new FreezedFixInfo(document.uri.path, 'fixImport', `Fix import 'package:freezed_annotation/freezed_annotation.dart';`, `import 'package:freezed_annotation/freezed_annotation.dart';`)
            this.runCommand(document, data)
        }
        if (!text.replace(/\s/g, '').includes('partof')&&!text.includes(`part '${baseFileName}.freezed.dart';`)) {
            let data = new FreezedFixInfo(document.uri.path, 'fixImport', `Fix import part '${baseFileName}.freezed.dart';`, `part '${baseFileName}.freezed.dart';`)
            this.runCommand(document, data)
        }

    }

    async runCommand(document: vscode.TextDocument, data: FreezedFixInfo) {
        await vscode.commands.executeCommand(this.getCommand(), { command: FreezedFixer.command, title: data.title, data: data, arguments: [document, data] });

    }
    // 檢查是否為part 開頭 '"; 結尾
    isPartLine(document: vscode.TextDocument, range: vscode.Range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        return FreezedFixer.partLineRegex.exec(line.text) != null;
    }
    // 編輯時對單行檢測
    public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] | undefined {
        // 若游標所在位置不在笑臉符號的開頭，則不提供動作
        let data = this.handleLine(document, range);
        if (data == null)
            return;
        const quickFixPart = this.createFixAction(document, range, data);
        const diagnostic = new vscode.Diagnostic(range, `${data.msg}`, vscode.DiagnosticSeverity.Error);
        diagnostic.source = `\nlazy-jack \nFix import ${data.msg} in};`;
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
