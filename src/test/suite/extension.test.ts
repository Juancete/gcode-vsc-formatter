import * as assert from 'assert'

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
import * as GcodeFormatterExtension from '../../extension'

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.')
	const line = 'G3X100.08Y3.11I28.91;J4.36;'
	const lineSpaced = 'G3 X100.08 Y3.11 I28.91 J4.36;'
	const lineSuperSpaced = 'G3  X100.08    Y3.11    I28.91   J4.36;'

	test('If Code is at the start, does not add a space', () => {
		assert.equal('G3X100.08Y3.11I28.91;J4.36;', GcodeFormatterExtension.intercalate('G')(line))
	})
	test('If Code is not at the start, add a space', () => {
		assert.equal('G3 X100.08Y3.11I28.91;J4.36;', GcodeFormatterExtension.intercalate('X')(line))
	})
	test('If Code is tabulated, then remains equals', () => {
		assert.equal('G3 X100.08 Y3.11 I28.91 J4.36;', GcodeFormatterExtension.intercalate('X')(lineSpaced))
	})	
	test('If line had a semicolon at the end of line, the last semicolon is removed', () => {
		assert.equal('G3X100.08Y3.11I28.91;J4.36', GcodeFormatterExtension.removeSemicolons(line))
	})
	test('If line had more than one semicolon at the end of line, all semicolons are removed', () => {
		assert.equal('G3X100.08Y3.11I28.91;J4.36', GcodeFormatterExtension.removeSemicolons(line.concat(';;;')))
	})
	test('If line with no semicolon at the end of line, then the line remains equals', () => {
		assert.equal('G3X100.08Y3.11I28.91;J4.36', GcodeFormatterExtension.removeSemicolons(line.slice(0, -1)))
	})
	test('If line had a semicolon at the middle of line, then the line is splitted', () => {
		assert.equal('G3X100.08Y3.11I28.91\nJ4.36', GcodeFormatterExtension.splitBySemicolons(GcodeFormatterExtension.removeSemicolons(line)))
	})
	test('If Code has one digit, then formats to two digits', () => {
		assert.equal('G03X100.08Y3.11I28.91;J4.36;', GcodeFormatterExtension.commandsWithTwoDigits('G')(line))
	})
	test('If Code has two digits, then remains equals', () => {
		assert.equal('G03', GcodeFormatterExtension.commandsWithTwoDigits('G')('G03'))
	})
	test('If line has more than one space, then trim useless spaces', ()=>{
		assert.equal(lineSpaced,GcodeFormatterExtension.trimSpaces(lineSuperSpaced))
	})
})
