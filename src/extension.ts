import * as vscode from 'vscode'

type stringTransformer = (character: string) => (text: string) => string

const charactersFromCodeWithDigits = ['G', 'M', 'T']
const characters = charactersFromCodeWithDigits.concat(['X', 'Y', 'Z', 'I', 'J', 'S', 'R', 'F', 'C'])

export function activate(context: vscode.ExtensionContext) {
	const block = {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			var coleccion: vscode.TextEdit[] = formatLine(document.lineAt(0))

			for (let i = 1; i < document.lineCount; i++) {
				coleccion = coleccion.concat(formatLine(document.lineAt(i)))
			}
			return coleccion
		}
	}

	const disposable = vscode.languages.registerDocumentFormattingEditProvider('gcode', block)
	const otherDisposable = vscode.languages.registerDocumentFormattingEditProvider('centroid-gcode', block)

	context.subscriptions.push(disposable)
	context.subscriptions.push(otherDisposable)
}

export function formatLine(line: vscode.TextLine) {
	const formatter = pipe(...characters.map(intercalate),
		...charactersFromCodeWithDigits.map(commandsWithTwoDigits),
		trimSpaces,
		removeSemicolons,
		splitBySemicolons
	)
	const newString = formatter(line.text.toUpperCase())
	return [vscode.TextEdit.delete(line.range), vscode.TextEdit.insert(line.range.start, newString)]

}

export let intercalate: stringTransformer = (character: string) => (text: string) => {
	var position: number
	if (text.charAt(0) === character) {
		{
			position = text.slice(1).indexOf(character)
			if (position !== -1) { position++ }
		}
	}
	else { position = text.indexOf(character) }

	if (position !== -1 && text.charAt(position - 1) !== ' ' && text.charAt(position - 1) !== ',') {
		return text.slice(0, position).concat(' ').concat(intercalate(character)(text.slice(position)))
	}
	return text
}
const evaluateValidPosition = (position: number, aFunction: () => string, invalidString: string): string => (position !== -1) ? aFunction() : invalidString

export function splitBySemicolons(text: string): string {
	const position = text.indexOf(';')
	return evaluateValidPosition(position, () => [text.slice(0, position), '\n', splitBySemicolons(text.slice(position + 1)).trim()].join(''), text)
}

export function trimSpaces(text: string): string {
	const position = text.indexOf(' ')
	const evaluate = () => text.slice(0, (text.charAt(position + 1) === ' ') ? position : position + 1).concat(trimSpaces(text.slice(position + 1)))
	return evaluateValidPosition(position, evaluate, text)
}

export let commandsWithTwoDigits: stringTransformer = (character: string) => (text: string) => {
	const position = text.indexOf(character)
	const condition = isNaN(+text.charAt(position + 2)) || text.charAt(position + 2) === ' '
	return evaluateValidPosition(position, () => text.slice(0, position + 1).concat(condition ? '0' : '').concat(commandsWithTwoDigits(character)(text.slice(position + 1))), text)
}

export const removeSemicolons = (text: string): string => (text.slice(text.length - 1) === ';') ? removeSemicolons(text.slice(0, -1)) : text

// this method is called when your extension is deactivated
export function deactivate() { }

const pipe = <R>(...fns: Array<(a: R) => R>) =>
	fns.reduce((prevFn, nextFn) => value => nextFn(prevFn(value)))