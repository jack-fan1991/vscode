"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const snippet_utils_1 = require("./utils/snippet_utils");
const generate_getter_setter_1 = require("./dart/generate getter_setter");
const fast_cmd_1 = require("./github/fast_cmd");
const sidebar = require("./sidebar");
function activate(context) {
    console.log('your extension "sugar-demo-vscode" is now active!');
    (0, snippet_utils_1.registerDartSnippet)(context);
    (0, generate_getter_setter_1.registerGenerateGetterSetter)(context);
    (0, fast_cmd_1.registerFastGithubCmd)(context);
    //註冊 views id
    vscode.window.registerTreeDataProvider("flutter-lazy-cmd", new sidebar.FlutterTreeDataProvider());
    vscode.window.registerTreeDataProvider("build_runner-lazy-cmd", new sidebar.RunBuilderTreeDataProvider());
    vscode.window.registerTreeDataProvider("npm-lazy-cmd", new sidebar.NpmTreeDataProvider());
    vscode.window.registerTreeDataProvider("vscode-extension-lazy-cmd", new sidebar.VscodeExtensionTreeDataProvider());
    //註冊命令回調
    vscode.commands.registerCommand(sidebar.sidebar_command, (args) => {
        sidebar.onTreeItemSelect(context, args);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map