import * as vscode from 'vscode'
import { commandsWithTwoDigits, intercalate, removeSemicolons, splitBySemicolons, trimSpaces } from './stringFunctions'

const charactersFromCodeWithDigits = ['G', 'M', 'T']
const characters = charactersFromCodeWithDigits.concat(['X', 'Y', 'Z', 'I', 'J', 'S', 'R', 'F', 'C'])

export function activate(context: vscode.ExtensionContext) {
	const block = {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			var coleccion: vscode.TextEdit[] = []
			for (let i = 0; i < document.lineCount; i++) {
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

const getComment = (line: string) => line.indexOf('(') === -1 ? '' : line.substring(line.indexOf('('))

export const formatText = (line: string) => {
	const formatter = pipe(...characters.map(intercalate),
		...charactersFromCodeWithDigits.map(commandsWithTwoDigits),
		trimSpaces,
		removeSemicolons
	)
	const lines: string[] = splitBySemicolons(line)
	return lines.map((aLine: string) => {
		const comment = getComment(aLine)
		const newString = formatter(aLine.toUpperCase().replace(/ *\([^)]*\) */g, ''))
		return newString + comment.toUpperCase()
	}).join('\n')
}

const formatLine = (line: vscode.TextLine) => [vscode.TextEdit.delete(line.range), vscode.TextEdit.insert(line.range.start, formatText(line.text))]

// this method is called when your extension is deactivated
export function deactivate() { }

const pipe = <R>(...fns: Array<(a: R) => R>) =>
	fns.reduce((prevFn, nextFn) => value => nextFn(prevFn(value)))
