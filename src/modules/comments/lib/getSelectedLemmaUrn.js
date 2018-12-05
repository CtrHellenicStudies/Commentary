

const getSelectedLemmaUrn = selectedLemma => {
	const lemmaCitation = Object.assign({}, selectedLemma.passageFrom);

	delete lemmaCitation.passage;
	lemmaCitation.passageFrom = selectedLemma.passageFrom.passage[0];
	lemmaCitation.passageTo = selectedLemma.passageTo.passage[0];

	return lemmaCitation;
}


export default getSelectedLemmaUrn;
