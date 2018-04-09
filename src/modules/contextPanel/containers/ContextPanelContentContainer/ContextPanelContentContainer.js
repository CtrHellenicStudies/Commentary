import React from 'react';
import { compose } from 'react-apollo';

// graphql
import textNodesQuery from '../../../textNodes/graphql/queries/textNodesQuery';
import { editionsQuery } from '../../../../graphql/methods/editions';

import ContextPanelContent from '../../components/ContextPanelContent';

// lib
import Utils from '../../../../lib/utils';


const ContextPanelContentContainer = props => {

  let textNodes = [];
  let versionsWithText = [];
  let translationsWithText = [];
  let selectedLemmaVersion = null;
  let selectedLemmaVersionIndex = 0;
  let multiline = false;

  if (
      props.textNodesQuery
    && props.textNodesQuery.textNodes
  ) {
    textNodes = props.textNodesQuery.textNodes;
  }


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

  return (
    <ContextPanelContent
      {...props}
      selectedLemmaVersion={selectedLemmaVersion}
    />
  );
}


export default compose(
  textNodesQuery,
  editionsQuery,
)(ContextPanelContentContainer);
