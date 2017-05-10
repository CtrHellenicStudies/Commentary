import React from 'react';
import IconButton from 'material-ui/IconButton';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// api:
import TextNodes from '/imports/api/collections/textNodes';

// components:
import ContextPanelText from '/imports/ui/components/commentary/contextPanel/ContextPanelText';
import ContextPanelTabs from '/imports/ui/components/commentary/contextPanel/ContextPanelTabs';

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
	open: React.PropTypes.bool.isRequired,
	commentGroup: React.PropTypes.shape({
		work: React.PropTypes.shape({
			slug: React.PropTypes.string.isRequired,
		}),
		subwork: React.PropTypes.shape({
			n: React.PropTypes.number.isRequired,
		}),
		lineFrom: React.PropTypes.number.isRequired,
		lineTo: React.PropTypes.number,
		ref: React.PropTypes.string.isRequired,
	}),
	closeContextPanel: React.PropTypes.func,
	highlightingVisible: React.PropTypes.bool.isRequired,
	onBeforeClicked: React.PropTypes.func.isRequired,
	onAfterClicked: React.PropTypes.func.isRequired,
	selectedLemmaEdition: React.PropTypes.string.isRequired,
	lemmaText: React.PropTypes.arrayOf(React.PropTypes.shape({
		title: React.PropTypes.string.isRequired,
		slug: React.PropTypes.string.isRequired,
		lines: React.PropTypes.arrayOf(React.PropTypes.shape({
			n: React.PropTypes.number.isRequired,
			html: React.PropTypes.string.isRequired,
		})).isRequired,
	})).isRequired,
	lineFrom: React.PropTypes.number.isRequired,
	lineTo: React.PropTypes.number.isRequired,
	maxLine: React.PropTypes.number.isRequired,
	toggleEdition: React.PropTypes.func.isRequired,
	toggleHighlighting: React.PropTypes.func.isRequired,
	workSlug: React.PropTypes.string.isRequired,
	subworkN: React.PropTypes.number.isRequired,

	// requiered if editor:
	disableEdit: React.PropTypes.bool,
	selectedLineFrom: React.PropTypes.number,
	selectedLineTo: React.PropTypes.number,
	updateSelectedLines: React.PropTypes.func,
	editor: React.PropTypes.bool,
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


export default createContainer(({ lineFrom, workSlug, subworkN }) => {

	const lineTo = lineFrom + 49;

	const lemmaQuery = {
		'work.slug': workSlug,
		'subwork.n': subworkN,
		'text.n': {
			$gte: lineFrom,
			$lte: lineTo,
		},
	};

	if (lemmaQuery['work.slug'] === 'homeric-hymns') {
		lemmaQuery['work.slug'] = 'hymns';
	}

	Meteor.subscribe('textNodes', lemmaQuery);
	const textNodes = TextNodes.find(lemmaQuery).fetch();
	const editions = [];

	let textIsInEdition = false;
	textNodes.forEach((textNode) => {
		textNode.text.forEach((text) => {
			textIsInEdition = false;

			editions.forEach((edition) => {
				if (text.edition.slug === edition.slug) {
					edition.lines.push({
						html: text.html,
						n: text.n,
					});
					textIsInEdition = true;
				}
			});

			if (!textIsInEdition) {
				editions.push({
					title: text.edition.title,
					slug: text.edition.slug,
					lines: [
						{
							html: text.html,
							n: text.n,
						},
					],
				});
			}
		});
	});

	const sortedEditions = getSortedEditions(editions);

	return {
		lemmaText: sortedEditions,
		lineTo,
	};

}, ContextPanelContent);
