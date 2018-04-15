import serializeUrn from '../../cts/lib/serializeUrn';


const getSelectedLemmaUrn = selectedLemma => {
	const lemmaCitation = Object.assign({}, selectedLemma.passageFrom);

	delete lemmaCitation.passage;
	lemmaCitation.passageFrom = selectedLemma.passageFrom.passage;
	lemmaCitation.passageTo = selectedLemma.passageTo.passage;

	const urn = serializeUrn(lemmaCitation);
	return urn;
}


export default getSelectedLemmaUrn;
