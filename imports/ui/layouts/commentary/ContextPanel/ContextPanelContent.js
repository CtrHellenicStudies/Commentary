import IconButton from 'material-ui/IconButton';
import { createContainer } from 'meteor/react-meteor-data';

// api:
import TextNodes from '/imports/collections/textNodes'; // eslint-disable-line import/no-absolute-path

// components:
import ContextPanelText from '/imports/ui/components/commentary/contextPanel/ContextPanelText'; // eslint-disable-line import/no-absolute-path
import ContextPanelTabs from '/imports/ui/components/commentary/contextPanel/ContextPanelTabs'; // eslint-disable-line import/no-absolute-path

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

const ContextPanelContent = ({ open, highlightingVisible, closeContextPanel, onBeforeClicked, onAfterClicked, selectedLemmaEdition, lemmaText, lineFrom, commentGroup, maxLine, toggleEdition, toggleHighlighting }) => (
	<div className={getContextPanelStyles(open, highlightingVisible)}>

		<IconButton
			className="close-lemma-panel"
			onClick={closeContextPanel}
			iconClassName="mdi mdi-close"
		/>

		<ContextPanelText
			onBeforeClicked={onBeforeClicked}
			onAfterClicked={onAfterClicked}
			selectedLemmaEdition={selectedLemmaEdition}
			lemmaText={lemmaText}
			lineFrom={lineFrom}
			commentGroup={commentGroup}
			maxLine={maxLine}
		/>

		<ContextPanelTabs
			lemmaText={lemmaText}
			selectedLemmaEdition={selectedLemmaEdition}
			toggleEdition={toggleEdition}
			toggleHighlighting={toggleHighlighting}
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
	}).isRequired,
	closeContextPanel: React.PropTypes.func.isRequired,
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
		}))
	})).isRequired,
	lineFrom: React.PropTypes.number.isRequired,
	maxLine: React.PropTypes.number.isRequired,
	toggleEdition: React.PropTypes.func.isRequired,
	toggleHighlighting: React.PropTypes.func.isRequired,
};


export default createContainer(({ commentGroup, lineFrom }) => {

	const lemmaQuery = {
		'work.slug': commentGroup.work.slug,
		'subwork.n': commentGroup.subwork.n,
		'text.n': {
			$gte: lineFrom,
			$lte: lineFrom + 49,
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

	return {
		lemmaText: editions,
	};

}, ContextPanelContent);
