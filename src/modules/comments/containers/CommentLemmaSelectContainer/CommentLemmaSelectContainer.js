import React from 'react';
import { compose } from 'react-apollo';

import textNodesQuery from '../../../textNodes/graphql/queries/textNodesQuery';
import { editionsQuery } from '../../../../graphql/methods/editions';

import CommentLemmaSelect from '../../components/CommentLemmaSelect/CommentLemmaSelect';


// lib
import Utils from '../../../../lib/utils';


const CommentLemmaSelectContainer = props => {

	let textNodes = [];
	let versionsWithText = [];
	let translationsWithText = [];
	let selectedLemmaVersion = null;
	let selectedLemmaTranslation = null;
	let selectedLemmaVersionIndex = 0;
	let selectedLemmaTranslationIndex = 0;
	let multiline = false;

	if (
		props.textNodesQuery
    && props.textNodesQuery.textNodes
	) {
		textNodes = props.textNodesQuery.textNodes;
	}

	console.log('######')
	console.log('######')
	console.log('######')
	console.log(props);
	console.log('######')
	console.log('######')
	console.log('######')


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
		&& versionsWithText[selectedLemmaTranslationIndex]
	) {
		selectedLemmaVersion = versionsWithText[selectedLemmaVersionIndex];
		selectedLemmaTranslation = versionsWithText[selectedLemmaTranslationIndex];
	}


	return (
		<CommentLemmaSelect
			selectedLemmaCitation={props.selectedLemmaCitation}
			selectedLemmaVersion={selectedLemmaVersion}
			selectedLemmaTranslation={selectedLemmaTranslation}
		/>
	);
}

export default compose(textNodesQuery)(CommentLemmaSelectContainer);
