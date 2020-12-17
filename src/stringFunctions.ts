type stringTransformer = (character: string) => (text: string) => string

export const intercalate: stringTransformer = (character: string) => (text: string) => {
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

export let commandsWithTwoDigits: stringTransformer = (character: string) => (text: string) => {
	const position = text.indexOf(character)
	const condition = isNaN(+text.charAt(position + 2)) || text.charAt(position + 2) === ' '
	return evaluateValidPosition(position, () => text.slice(0, position + 1).concat(condition ? '0' : '').concat(commandsWithTwoDigits(character)(text.slice(position + 1))), text)
}

export const removeSemicolons = (text: string): string => (text.slice(text.length - 1) === ';') ? removeSemicolons(text.slice(0, -1)) : text

const evaluateValidPosition = (position: number, aFunction: () => string, invalidString: string): string => (position !== -1) ? aFunction() : invalidString

export const splitBySemicolons = (text: string): string[] => text.split(';').filter((element)=> element !== '')

export const trimSpaces = (text: string) => trimSpaceInMiddle(text.replace(/^\s+/g, ''))

function trimSpaceInMiddle (text: string): string {
	const position = text.indexOf(' ')
	const evaluate = () => text.slice(0, (text.charAt(position + 1) === ' ') ? position : position + 1).concat(trimSpaceInMiddle(text.slice(position + 1)))
	return evaluateValidPosition(position, evaluate, text)
}