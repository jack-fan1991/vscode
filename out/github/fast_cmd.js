"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFastGithubCmd = void 0;
const vscode = require("vscode");
const terminal_util = require("../utils/terminal_utils");
const command_open_github_repo = 'command_open_github_repo';
const command_open_github_actions = 'command_open_github_actions';
const command_open_github_wiki = 'command_open_github_wiki';
const command_open_sourcetree_local_repo = 'command_open_sourcetree_local_repo';
function registerFastGithubCmd(context) {
    context.subscriptions.push(vscode.commands.registerCommand(command_open_github_repo, () => __awaiter(this, void 0, void 0, function* () {
        openGitHubBrowserAction(context, "repo");
    })));
    context.subscriptions.push(vscode.commands.registerCommand(command_open_github_actions, () => __awaiter(this, void 0, void 0, function* () {
        openGitHubBrowserAction(context, "actions");
    })));
    context.subscriptions.push(vscode.commands.registerCommand(command_open_github_wiki, () => __awaiter(this, void 0, void 0, function* () {
        openGitHubBrowserAction(context, "wiki");
    })));
    context.subscriptions.push(vscode.commands.registerCommand(command_open_sourcetree_local_repo, () => __awaiter(this, void 0, void 0, function* () {
        terminal_util.runTerminal(context, "open -a SourceTree ./");
    })));
}
exports.registerFastGithubCmd = registerFastGithubCmd;
function openGitHubBrowserAction(context, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = vscode.workspace.rootPath;
        let uri = yield terminal_util.runCommand("cd " + cwd + " && git config --get remote.origin.url");
        uri = uri.replace("git@github.com:", "https://github.com/").split('.git')[0];
        switch (args) {
            case "repo":
                break;
            case "pr":
                uri = uri + '/' + 'pulls';
                break;
            case "actions":
            case "wiki":
                uri = uri + '/' + args;
                break;
        }
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(uri));
    });
}
//# sourceMappingURL=fast_cmd.js.map