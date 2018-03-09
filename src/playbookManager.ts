'use strict';

import * as vscode from 'vscode';

export class PlaybookManager {
    constructor() {
    }

    public doesTaskExistByName(name: string, beforeCursor: boolean) {
        if (vscode.window.activeTextEditor != undefined && vscode.window.activeTextEditor.document.languageId == "yaml") {
            let text: string = null;
            if (beforeCursor) {
                text = vscode.window.activeTextEditor.document.getText(new vscode.Range(new vscode.Position(0, 0), vscode.window.activeTextEditor.selection.start));
            } else {
                text = vscode.window.activeTextEditor.document.getText();
            }

            let authorisationTaskPosition: number = text.indexOf("- name: " + name);
            return authorisationTaskPosition >= 0;
        }

        // just a simple approach for now
        return false;
    }

    public insertTask(task: string) {
        let __this = this;
        
        // create new yaml document if not current document
        if (vscode.window.activeTextEditor == undefined || vscode.window.activeTextEditor.document.languageId != "yaml") {
            vscode.workspace.openTextDocument({language: "yaml", content: ""} ).then((a: vscode.TextDocument) => {
                vscode.window.showTextDocument(a, 1, false).then(e => {
                    let prefix: string[] = ["- hosts: localhost",
                                            "  tasks:"];
                    __this.insertTask(task);
                });
            });
        } else {

            let insertionPoint = new vscode.Position(vscode.window.activeTextEditor.document.lineCount, 0);
            vscode.window.activeTextEditor.insertSnippet(new vscode.SnippetString(task), insertionPoint);
        }
    }
}
