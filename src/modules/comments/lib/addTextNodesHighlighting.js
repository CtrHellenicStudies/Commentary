/**
 * Add the highlighting of the lemma to the input source text nodes
 */

const addTextNodesHighlighting = (_selectedLemmaVersion, selectedLemmaCitation) => {
	const selectedLemmaVersion = Object.assign({}, _selectedLemmaVersion);

	if (selectedLemmaVersion.textNodes.length > 1) {
		selectedLemmaVersion.textNodes[0].text = `
			<span class="lemmaTextUnselected">
				${selectedLemmaVersion.textNodes[0].text.slice(0, selectedLemmaCitation.subreferenceIndexFrom)}
			</span>
			<span class="lemmaTextSelected">
				${selectedLemmaVersion.textNodes[0].text.slice(selectedLemmaCitation.subreferenceIndexFrom, selectedLemmaVersion.textNodes[0].text.length)}
			</span>
		`;

		selectedLemmaVersion.textNodes[selectedLemmaVersion.textNodes.length - 1].text = `
			<span class="lemmaTextSelected">
				${selectedLemmaVersion.textNodes[selectedLemmaVersion.textNodes.length - 1].text.slice(0, selectedLemmaCitation.subreferenceIndexTo)}
			</span>
			<span class="lemmaTextUnselected">
				${selectedLemmaVersion.textNodes[selectedLemmaVersion.textNodes.length - 1].text.slice(selectedLemmaCitation.subreferenceIndexTo, selectedLemmaVersion.textNodes[selectedLemmaVersion.textNodes.length - 1].text.length)}
			</span>
		`;
	} else if (selectedLemmaVersion.textNodes.length === 1){
		selectedLemmaVersion.textNodes[0].text = `
			<span class="lemmaTextUnselected">
				${selectedLemmaVersion.textNodes[0].text.slice(0, selectedLemmaCitation.subreferenceIndexFrom)}
			</span>
			<span class="lemmaTextSelected">
				${selectedLemmaVersion.textNodes[0].text.slice(selectedLemmaCitation.subreferenceIndexFrom, selectedLemmaCitation.subreferenceIndexTo)}
			</span>
			<span class="lemmaTextUnselected">
				${selectedLemmaVersion.textNodes[0].text.slice(selectedLemmaCitation.subreferenceIndexTo, selectedLemmaVersion.textNodes[0].text.length)}
			</span>
		`;
	}

	return selectedLemmaVersion;
}

export default addTextNodesHighlighting;
