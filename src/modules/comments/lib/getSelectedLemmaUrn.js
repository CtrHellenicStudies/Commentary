import serializeUrn from '../../cts/lib/serializeUrn';


const getSelectedLemmaUrn = selectedLemma => {
  const lemmaCitation = Object.assign({}, selectedLemma.passageFrom);

  delete lemmaCitation.passage;
  lemmaCitation.passage = selectedLemma.passageFrom.passage;
  // lemmaCitation.passageFrom = selectedLemma.passageFrom.passage;
  // lemmaCitation.passageTo = selectedLemma.passageTo.passage;

  const urn = serializeUrn(lemmaCitation);
  console.log(urn)
  return urn;
}


export default getSelectedLemmaUrn;
