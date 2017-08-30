import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createContainer } from 'meteor/react-meteor-data';


// actions
import * as textNodesActions from '/imports/actions/textNodes';

// api:
import TextNodes from '/imports/models/textNodes';
import Editions from '/imports/models/editions';

// lib:
import Utils from '/imports/lib/utils';

// components
import TextNodesInput from '../TextNodesInput';
import WorkInput from '../WorkInput';
import SubworkInput from '../SubworkInput';
import EditionInput from '../EditionInput';


/*
	helpers
*/
const getContextPanelStyles = (open, highlightingVisible) => {
	let contextPanelStyles = 'lemma-panel paper-shadow';
	if (open) {
		contextPanelStyles += ' extended';
	}
	if (highlightingVisible) {
		contextPanelStyles += ' highlighting-visible';
	}
	return contextPanelStyles;
};

const getSortedEditions = (editions) => {
	const sortedEditions = [];
	editions.forEach((edition) => {
		const newEdition = {
			slug: edition.slug,
			title: edition.title,
			lines: _.sortBy(edition.lines, 'n')
		};
		sortedEditions.push(newEdition);
	});
	return sortedEditions;
};


class TextNodesEditor extends React.Component {


	render() {
		return (
			<div>
				<WorkInput />
				<EditionInput />
				<SubworkInput />
				<TextNodesInput />
			</div>
		);
	}
}

const TextNodesEditorContainer = createContainer(({ lineFrom, workSlug, subworkN }) => {

	const lemmaQuery = {
		'work.slug': workSlug,
		'subwork.n': subworkN,
		'text.n': {
			$gte: lineFrom,
			$lte: lineFrom + 49,
		},
	};

	if (lemmaQuery['work.slug'] === 'homeric-hymns') {
		lemmaQuery['work.slug'] = 'hymns';
	}

	Meteor.subscribe('textNodes', lemmaQuery);
	const editionsSubscription = Meteor.subscribe('editions');
	const editions = Editions.find().fetch();
	const textNodesCursor = TextNodes.find(lemmaQuery);
	const editionsRaw = editionsSubscription.ready() ? Utils.textFromTextNodesGroupedByEdition(textNodesCursor, Editions) : [];
	const editionsSorted = getSortedEditions(editionsRaw);

	return {
		lemmaText: editionsSorted,
		editions,
	};

}, TextNodesEditor);

const mapStateToProps = (state, props) => ({
	textNodes: state.textNodes.textNodes,
	work: state.textNodes.work,
	subwork: state.textNodes.subwork,
	edition: state.textNodes.edition,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(textNodesActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextNodesEditorContainer);
