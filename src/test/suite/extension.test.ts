import * as assert from 'assert'

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
import * as GcodeFormatterExtension from '../../extension'
import * as AuxFunctions from '../../stringFunctions'

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.')
	const line = 'G3X100.08Y3.11I28.91;J4.36;'
	const lineSpaced = 'G3 X100.08 Y3.11 I28.91 J4.36;'
	const lineSuperSpaced = ' G3  X100.08    Y3.11    I28.91   J4.36;'
	const comment = '(test circle)'
	const conditional = 'IF[[#GYGZ]EQ0]GOTO999'

	test('If Code is at the start, does not add a space', () => {
		assert.strictEqual('G3X100.08Y3.11I28.91;J4.36;', AuxFunctions.intercalate('G')(line))
	})
	test('If Code is not at the start, add a space', () => {
		assert.strictEqual('G3 X100.08Y3.11I28.91;J4.36;', AuxFunctions.intercalate('X')(line))
	})
	test('If Code is tabulated, then remains equals', () => {
		assert.strictEqual('G3 X100.08 Y3.11 I28.91 J4.36;', AuxFunctions.intercalate('X')(lineSpaced))
	})
	test('If line had a semicolon at the end of line, the last semicolon is removed', () => {
		assert.strictEqual('G3X100.08Y3.11I28.91;J4.36', AuxFunctions.removeSemicolons(line))
	})
	test('If line had more than one semicolon at the end of line, all semicolons are removed', () => {
		assert.strictEqual('G3X100.08Y3.11I28.91;J4.36', AuxFunctions.removeSemicolons(line.concat(';;;')))
	})
	test('If line with no semicolon at the end of line, then the line remains equals', () => {
		assert.strictEqual('G3X100.08Y3.11I28.91;J4.36', AuxFunctions.removeSemicolons(line.slice(0, -1)))
	})
	test('If line had a semicolon at the middle of line, then the line is splitted', () => {
		assert.notStrictEqual(['G3X100.08Y3.11I28.91', 'J4.36'], AuxFunctions.splitBySemicolons(AuxFunctions.removeSemicolons(line)))
	})
	test('If Code has one digit, then formats to two digits', () => {
		assert.strictEqual('G03X100.08Y3.11I28.91;J4.36;', AuxFunctions.commandsWithTwoDigits('G')(line))
	})
	test('If Code has two digits, then remains equals', () => {
		assert.strictEqual('G03', AuxFunctions.commandsWithTwoDigits('G')('G03'))
	})
	test('If line has more than one space, then trim useless spaces', () => {
		assert.strictEqual(lineSpaced, AuxFunctions.trimSpaces(lineSuperSpaced))
	})
	test('If line has a comment, then formatter do nothing', () => {
		assert.strictEqual(comment.toUpperCase(), GcodeFormatterExtension.formatText(comment))
	})
	test('If line has a conditional, then formatter do nothing', () => {
		assert.strictEqual(conditional.toUpperCase(), GcodeFormatterExtension.formatText(conditional))
	})
})
