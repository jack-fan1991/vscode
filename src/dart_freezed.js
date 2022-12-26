const vscode = require('vscode');
const command_import_freezed_part = 'dart.import.freezed';
const command_create_freezed_class_by_base_fileName = 'command_create_freezed_class_by_base_fileName';
const command_create_freezed_class_with_state_by_base_fileName = 'command_create_freezed_class_with_state_by_base_fileName';
const command_new_freezed_state_by_base_fileName = 'command_add_freezed_state_by_base_fileName';
const command_create_from_json = 'command_create_from_json';

const snippet_import_freezed = 'import freezed part'
const snippet_create_freezed_class = 'Create Freezed Data Class'
const snippet_create_freezed_with_state_class = 'Create Freezed class with state'
const snippet_new_freezed_state = 'Add New freezed State'
const snippet_create_from_json = 'Crate FromJson'



module.exports = function(context) {
    context.subscriptions.push(vscode.commands.registerCommand(command_import_freezed_part, async() => {
        await vscode.commands.executeCommand("editor.action.insertSnippet",{"name":snippet_import_freezed});
    }));
    context.subscriptions.push(vscode.commands.registerCommand(command_create_freezed_class_by_base_fileName, async() => {
        await vscode.commands.executeCommand("editor.action.insertSnippet",{"name":snippet_create_freezed_class});
    }));
    context.subscriptions.push(vscode.commands.registerCommand(command_create_freezed_class_with_state_by_base_fileName, async() => {
        await vscode.commands.executeCommand("editor.action.insertSnippet",{"name":snippet_create_freezed_with_state_class});
    }));
    context.subscriptions.push(vscode.commands.registerCommand(command_new_freezed_state_by_base_fileName, async() => {
        await vscode.commands.executeCommand("editor.action.insertSnippet",{"name":snippet_new_freezed_state});
    }));
    context.subscriptions.push(vscode.commands.registerCommand(command_create_from_json, async() => {
        await vscode.commands.executeCommand("editor.action.insertSnippet",{"name":snippet_create_from_json});
    }));
};