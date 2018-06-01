// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const puppeteer = require('puppeteer');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "deepl-translate" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.translate', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        
        let editor = vscode.window.activeTextEditor;
        if (!editor){
            return;
        }
        let selection = editor.selection;
        
        
        let text = editor.document.getText(selection);
        vscode.window.showInformationMessage('Translating: ' +text);

        translate(text)
            .then((translated)=>{
                editor.edit((builder)=>{
                    builder.replace(selection,translated);
                    vscode.window.showInformationMessage('Translating done!');
                    
                })
            })

        


        


    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;


function translate(text){
    return new Promise((resolve, reject)=>{
        let translatePage = undefined;
        puppeteer.launch()
            .then(browser =>{
                return browser.newPage();
            })
            .then(page=>{
                translatePage = page;
                return page.goto(`https://www.deepl.com/translator#en/de/${encodeURIComponent(text)}`);
            }) 
            .then(response=>{
                setTimeout(()=>{
                    translatePage.evaluate(()=>{
                        return document.getElementsByClassName('lmt__target_textarea')[0].value
                    })
                    .then(data=>{
                        resolve(data);
                    })
                }, 1000)
                
            })
    })
}