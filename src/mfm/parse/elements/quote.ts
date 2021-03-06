/**
 * Quoted text
 */

export type TextElementQuote = {
	type: 'quote';
	content: string;
	quote: string;
};

export default function(text: string, isBegin: boolean) {
	const match = text.match(/^"([\s\S]+?)\n"/) || text.match(/^\n>([\s\S]+?)(\n\n|$)/) ||
		(isBegin ? text.match(/^>([\s\S]+?)(\n\n|$)/) : null);

	if (!match) return null;

	const quote = match[1]
		.split('\n')
		.map(line => line.replace(/^>+/g, '').trim())
		.join('\n')
		.trim();

	return {
		type: 'quote',
		content: match[0],
		quote: quote,
	} as TextElementQuote;
}
