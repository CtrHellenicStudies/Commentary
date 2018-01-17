import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import { compose } from 'react-apollo';
import _ from 'lodash';

// components:
import ContextPanelText from './ContextPanelText';
import ContextPanelTabs from './ContextPanelTabs';

// graphql
import { textNodesQuery } from '../../../graphql/methods/textNodes';
import { editionsQuery } from '../../../graphql/methods/editions';

// lib:
import Utils from '../../../lib/utils';

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

		if (nextProps.textNodesQuery.loading || nextProps.editionsQuery.loading) {
			return;
		}
		const lineTo = !nextProps.lineTo || lineFrom > nextProps.lineTo ? lineFrom : nextProps.lineTo;	
		if (!nextProps.textNodesQuery.variables.workSlug) {

<<<<<<< HEAD
			const { workSlug, subworkN } = nextProps;	
			const code = Utils.encodeBookBySlug(workSlug);
			const 	properties = Utils.getCollectionQueryProperties(Utils.createLemmaCitation(
				code.urn, lineFrom, lineTo
			));
			nextProps.collectionQuery.refetch(properties);
		}
	
		const textNodesCursor = nextProps.collectionQuery.collection.textGroup.work.textNodes;
=======
			const { workSlug, subworkN } = nextProps;		
			const properties = {
				workSlug: workSlug,
				work: workSlug,
				subworkN: subworkN,
				lineFrom: lineFrom,
				lineTo: lineTo,
				start: lineFrom,
				end: lineTo
			};
			nextProps.textNodesQuery.refetch(properties);
		}
	
		const textNodesCursor = nextProps.textNodesQuery.textNodesAhcip;
>>>>>>> develop
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
						iconClassName="material-icons"
					>close
					</IconButton>

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
