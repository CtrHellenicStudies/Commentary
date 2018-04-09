import React from 'react';
import { compose } from 'react-apollo';

// graphql
import textNodesQuery from '../../../textNodes/graphql/queries/textNodesQuery';
import { editionsQuery } from '../../../../graphql/methods/editions';

import ContextPanelContent from '../../components/ContextPanelContent';


const ContextPanelContentContainer = props => {

  let textNodes = [];

  if (
      props.textNodesQuery
    && props.textNodesQuery.textNodes
  ) {
    textNodes = props.textNodesQuery.textNodes;
  }

  console.log(textNodes);


	/**
	// TODO: potentially structure data from backend to prevent this transformation
	// in the future
	// set versions from textnodes data
	if (textNodes && textNodes.length) {
		const allVersions = Utils.textFromTextNodesGroupedByVersion(textNodes);
		versionsWithText = allVersions.versions;
		translationsWithText = allVersions.translations;
	}

	// if necessary, parse versions into multiline data
	versionsWithText = multiline ?
		Utils.parseMultilineVersion(versionsWithText, multiline)
		:
		versionsWithText;

	// set selected version
	if (
		versionsWithText.length
		&& versionsWithText[selectedLemmaVersionIndex]
	) {
		selectedLemmaVersion = versionsWithText[selectedLemmaVersionIndex];
	}
	*/

  return (
    <ContextPanelContent
      {...props}
    />
  );
}


export default compose(
  textNodesQuery,
  editionsQuery,
)(ContextPanelContentContainer);
