/**
 * Get the text node class that determines highlighting
 */
const getTextNodeClass = (textNodeFrom, textNodeTo, n, highlightingVisible) => {
	let usedLineTo = textNodeFrom;

	if (textNodeTo) {
		usedLineTo = textNodeTo;
	}

	let textNodeClass = 'lemma-textNode';
	if (textNodeFrom <= n && n <= usedLineTo && highlightingVisible) {
		textNodeClass += ' highlighted';
	}
	return textNodeClass;
};

export default getTextNodeClass;
