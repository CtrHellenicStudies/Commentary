import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import { Meteor } from 'meteor/meteor';
import { compose } from 'react-apollo';

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



class ContextPanelContent extends Component {
	constructor(props) {
		super(props);
		const { lineFrom } = props;
		this.state = {
			lineTo: lineFrom + 49
		};
	}
	componentWillReceiveProps(nextProps) {

		const { lineFrom, multiline } = nextProps;
		const tenantId = sessionStorage.getItem('tenantId');

		if (nextProps.textNodesQuery.loading || nextProps.editionsQuery.loading) {
			return;
		}
		const lineTo = !nextProps.lineTo || lineFrom > nextProps.lineTo ? lineFrom : nextProps.lineTo;	
		if (!nextProps.textNodesQuery.variables.workSlug) {

			const { workSlug, subworkN } = nextProps;		
			const properties = {
				workSlug: workSlug,
				subworkN: subworkN,
				lineFrom: lineFrom,
				lineTo: lineTo
			};
			nextProps.textNodesQuery.refetch(properties);
		}
	
		const textNodesCursor = nextProps.textNodesQuery.textNodes;
		const editions = Utils.textFromTextNodesGroupedByEdition(textNodesCursor, nextProps.editionsQuery.editions);
	
		let sortedEditions;
	
		if (multiline) {
			const parsedEditions = Utils.parseMultilineEdition(editions, multiline);
			sortedEditions = getSortedEditions(parsedEditions);
		} else {
			sortedEditions = getSortedEditions(editions);
		}
		this.setState({
			lineTo: lineTo,
			lemmaText: sortedEditions
		});
	}
	render() {
		const { open, highlightingVisible, closeContextPanel, onBeforeClicked, onAfterClicked, selectedLemmaEdition, lineFrom, commentGroup, maxLine, toggleEdition,
			toggleHighlighting, disableEdit, selectedLineFrom, selectedLineTo, updateSelectedLines, editor } = this.props;
		const { lineTo, lemmaText } = this.state;
		return (
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
	}
}
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
	lineFrom: PropTypes.number.isRequired,
	lineTo: PropTypes.number.isRequired,
	maxLine: PropTypes.number.isRequired,
	toggleEdition: PropTypes.func.isRequired,
	toggleHighlighting: PropTypes.func.isRequired,
	workSlug: PropTypes.string,
	subworkN: PropTypes.number,

	// requiered if editor:
	disableEdit: PropTypes.bool,
	selectedLineFrom: PropTypes.number,
	selectedLineTo: PropTypes.number,
	updateSelectedLines: PropTypes.func,
	editor: PropTypes.bool,
	textNodesQuery: PropTypes.object,
	editionsQuery: PropTypes.object,
	multiline: PropTypes.bool
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
export default compose(
	editionsQuery,
	textNodesQuery
)(ContextPanelContent);
