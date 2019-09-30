import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const block ={
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			var coleccion: vscode.TextEdit[] = formatLine(document.lineAt(0));
			for (let i = 1; i < document.lineCount; i++) {
				coleccion = coleccion.concat(formatLine(document.lineAt(i)));
			}
			return coleccion;
		}
	};

	let disposable = vscode.languages.registerDocumentFormattingEditProvider('gcode', block);
	let otherDisposable = vscode.languages.registerDocumentFormattingEditProvider('centroid-gcode', block);

	context.subscriptions.push(disposable);
	context.subscriptions.push(otherDisposable);
}

function formatLine(line: vscode.TextLine) {
	const letters = ["G","X","Y","Z","T","S"];

	const formatter = pipe(...letters.map(intercalate),
		...letters.map(twoDigits),
		removeSemicolons,
		splitBySemicolons
	);
	var newString = formatter(line.text.toUpperCase());
	return [vscode.TextEdit.delete(line.range), vscode.TextEdit.insert(line.range.start, newString)];

}
type stringTransformer = (character: string) => (text: string) => string;

let intercalate: stringTransformer = (character: string) => (text: string) => {
	var position: number;
	if (text.charAt(0) === character) {
		{
			position = text.slice(1).indexOf(character);
			if (position !== -1) { position++; }
		}
	}
	else { position = text.indexOf(character); }

	if (position !== -1 && text.charAt(position - 1) !== " ") {

		return [text.slice(0, position), " "].join('').concat(intercalate(character)(text.slice(position)));
	}
	else { return text; }
};

let twoDigits: stringTransformer = (character: string) => (text: string) => {
	var position = text.indexOf(character);
	if(position !== -1){
		const value1 = isNaN(+text.charAt(position + 2 ));
		const value2 = text.charAt(position + 2);
		if (isNaN(+text.charAt(position + 2 )) || text.charAt(position + 2) === " "){
			return [text.slice(0, position+1), "0"].join('').concat(twoDigits(character)(text.slice(position+1)));
		}
		else{return text.slice(0, position+1).concat(twoDigits(character)(text.slice(position+1)));}
	}
	return text;
};

function removeSemicolons(text: string): string {
	if (text.slice(text.length - 1) === ";") {
		return text.slice(0, -1);
	}
	else { return text; }
}
function splitBySemicolons(text: string): string {
	var position = text.indexOf(";");
	if (text.indexOf(";") !== -1) {
		return [text.slice(0, position), "\n", splitBySemicolons(text.slice(position + 1)).trim()].join('');
	}
	else { return text; }
}
// this method is called when your extension is deactivated
export function deactivate() { }

const pipe = <R>(...fns: Array<(a: R) => R>) =>
	fns.reduce((prevFn, nextFn) => value => nextFn(prevFn(value)));