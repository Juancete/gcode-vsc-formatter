import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.languages.registerDocumentFormattingEditProvider('gcode', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			var coleccion: vscode.TextEdit[] = formatLine(document.lineAt(0));
			for (let i = 1; i < document.lineCount; i++) {
				coleccion = coleccion.concat(formatLine(document.lineAt(i)));
			}
			return coleccion;
		}
	});

	context.subscriptions.push(disposable);
}

function formatLine(line: vscode.TextLine) {
	const formatter = pipe(intercalate("G"),
		intercalate("X"),
		intercalate("Y"),
		intercalate("Z"),
		intercalate("T"),
		intercalate("S"),
		removeSemicolons,
		splitBySemicolons
	);
	var newString = formatter(line.text.toUpperCase());
	return [vscode.TextEdit.delete(line.range), vscode.TextEdit.insert(line.range.start, newString)];

}
type intercalate = (character: string) => (text: string) => string;

let intercalate: intercalate = (character: string) => (text: string) => {
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