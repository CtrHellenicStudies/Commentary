import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import { compose } from 'react-apollo';
import _ from 'lodash';

// components:
import ContextPanelText from '../ContextPanelText/ContextPanelText';
import ContextPanelTabs from '../ContextPanelTabs/ContextPanelTabs';

// graphql
import { textNodesQuery } from '../../../../graphql/methods/textNodes';
import { editionsQuery } from '../../../../graphql/methods/editions';

// lib:
import Utils from '../../../../lib/utils';

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

		const { lemmaCitation, multiline, filters } = nextProps;

		if (nextProps.textNodesQuery.loading || nextProps.editionsQuery.loading) {
			return;
		}
		if (!nextProps.textNodesQuery.variables.workUrn && !nextProps.textNodes) {
			const properties = Utils.getUrnTextNodesProperties(lemmaCitation);
			console.log(properties);
			nextProps.textNodesQuery.refetch(properties);
			return;
		}
		let _editions = nextProps.editionsQuery.collections[0].textGroups[0].works;
		if (filters.edition) {
			const workUrn = Utils.getUrnTextNodesProperties(lemmaCitation).workUrn.replace('tlg0013', 'tlg0012');
			_editions = nextProps.editionsQuery.collections[0].textGroups[0].works.filter(work => work.urn === workUrn);
			if(_editions.length <= filters.edition) {
				_editions = [_editions[filters.edition - 1]];
			} else {
				_editions = nextProps.editionsQuery.collections[0].textGroups[0].works;
			}
		}
		const textNodesCursor = nextProps.textNodes ? nextProps.textNodes : nextProps.textNodesQuery.collections[0].textGroups[0].works;
		const editions = Utils.textFromTextNodesGroupedByEdition(textNodesCursor, _editions);
	
		let sortedEditions;
	
		if (multiline) {
			const parsedEditions = Utils.parseMultilineEdition(editions, multiline);
			sortedEditions = getSortedEditions(parsedEditions);
		} else {
			sortedEditions = getSortedEditions(editions);
		}
		this.setState({
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
	filters: PropTypes.object,
	highlightingVisible: PropTypes.bool.isRequired,
	onBeforeClicked: PropTypes.func.isRequired,
	onAfterClicked: PropTypes.func.isRequired,
	selectedLemmaEdition: PropTypes.string.isRequired,
	lineFrom: PropTypes.number,
	lineTo: PropTypes.number,
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