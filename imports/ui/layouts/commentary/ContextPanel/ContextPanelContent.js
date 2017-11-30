import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import { Meteor } from 'meteor/meteor';
import { compose } from 'react-apollo';
import { createContainer } from 'meteor/react-meteor-data';

// models:
import TextNodes from '/imports/models/textNodes';

// components:
import ContextPanelText from '/imports/ui/components/commentary/contextPanel/ContextPanelText';
import ContextPanelTabs from '/imports/ui/components/commentary/contextPanel/ContextPanelTabs';

// graphql
import { editionsQuery } from '/imports/graphql/methods/editions';
import { textNodesQuery } from '/imports/graphql/methods/textNodes';

// lib:
import Utils from '/imports/lib/utils';

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



const ContextPanelContent = ({ open, highlightingVisible, closeContextPanel, onBeforeClicked, onAfterClicked, selectedLemmaEdition, lemmaText, lineFrom, lineTo, commentGroup, maxLine, toggleEdition, toggleHighlighting, disableEdit, selectedLineFrom, selectedLineTo, updateSelectedLines, editor }) => (
	<div className={getContextPanelStyles(open, highlightingVisible)}>

		{closeContextPanel &&
			<IconButton
				className="close-lemma-panel"
				onClick={closeContextPanel}
				iconClassName="mdi mdi-close"
			/>
		}

		<ContextPanelText
			onBeforeClicked={onBeforeClicked}
			onAfterClicked={onAfterClicked}
			selectedLemmaEdition={selectedLemmaEdition}
			lemmaText={lemmaText}
			lineFrom={lineFrom}
			lineTo={lineTo}
			commentGroup={commentGroup}
			maxLine={maxLine}
			highlightingVisible={highlightingVisible}
			disableEdit={disableEdit}
			selectedLineFrom={selectedLineFrom}
			selectedLineTo={selectedLineTo}
			updateSelectedLines={updateSelectedLines}
			editor={editor}
		/>

		<ContextPanelTabs
			lemmaText={lemmaText}
			selectedLemmaEdition={selectedLemmaEdition}
			toggleEdition={toggleEdition}
			toggleHighlighting={toggleHighlighting}
			highlightingVisible={highlightingVisible}
			disableEdit={disableEdit}
			editor={editor}
		/>

	</div>
);
ContextPanelContent.propTypes = {
	open: PropTypes.bool.isRequired,
	commentGroup: PropTypes.shape({
		work: PropTypes.shape({
			slug: PropTypes.string.isRequired,
		}),
		subwork: PropTypes.shape({
			n: PropTypes.number.isRequired,
		}),
		lineFrom: PropTypes.number.isRequired,
		lineTo: PropTypes.number,
		ref: PropTypes.string.isRequired,
	}),
	closeContextPanel: PropTypes.func,
	highlightingVisible: PropTypes.bool.isRequired,
	onBeforeClicked: PropTypes.func.isRequired,
	onAfterClicked: PropTypes.func.isRequired,
	selectedLemmaEdition: PropTypes.string.isRequired,
	lemmaText: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
		lines: PropTypes.arrayOf(PropTypes.shape({
			n: PropTypes.number.isRequired,
			html: PropTypes.string.isRequired,
		})).isRequired,
	})).isRequired,
	lineFrom: PropTypes.number.isRequired,
	lineTo: PropTypes.number.isRequired,
	maxLine: PropTypes.number.isRequired,
	toggleEdition: PropTypes.func.isRequired,
	toggleHighlighting: PropTypes.func.isRequired,
	workSlug: PropTypes.string.isRequired,
	subworkN: PropTypes.number.isRequired,

	// requiered if editor:
	disableEdit: PropTypes.bool,
	selectedLineFrom: PropTypes.number,
	selectedLineTo: PropTypes.number,
	updateSelectedLines: PropTypes.func,
	editor: PropTypes.bool,
};
ContextPanelContent.defaultProps = {
	commentGroup: null,
	closeContextPanel: null,

	disableEdit: false,
	selectedLineFrom: 0,
	selectedLineTo: 0,
	updateSelectedLines: null,
	editor: false,
};

const cont = createContainer(props => {

	const { lineFrom, workSlug, subworkN, multiline } = props;
	const lineTo = lineFrom + 49;
	const tenantId = Session.get('tenantId');
	const properties = {
		workSlug: workSlug === 'homeric-hymns' ? 'hymns' : workSlug,
		subworkN: subworkN,
		lineFrom: lineFrom,
		lineTo: lineTo
	};
	if (Utils.shouldRefetchQuery(properties, props.textNodesQuery.variables)) {
		props.textNodesQuery.refetch(properties);
	}

	const textNodesCursor = props.textNodesQuery.loading ? [] : props.textNodesQuery.textNodes;
	const editions = !props.editionsQuery.loading ?
		Utils.textFromTextNodesGroupedByEdition(textNodesCursor, props.editionsQuery.editions) : [];

	let sortedEditions;

	if (multiline) {
		const parsedEditions = Utils.parseMultilineEdition(editions, multiline);
		sortedEditions = getSortedEditions(parsedEditions);
	} else {
		sortedEditions = getSortedEditions(editions);
	}

	return {
		lemmaText: sortedEditions,
		lineTo,
	};

}, ContextPanelContent);
export default compose(editionsQuery, textNodesQuery)(cont);
