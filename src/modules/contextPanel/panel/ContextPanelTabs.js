import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

// lib:
import Utils from '../../../lib/utils';

/*
	helpers
*/
const getEditionTabClass = (selectedLemmaEdition, lemmaTextEdition, index) => {
	const normalClass = 'version-tab tab';
	const selectedClass = 'version-tab tab selected-version-tab';

	if (!selectedLemmaEdition.length && index === 0) return selectedClass;
	if (selectedLemmaEdition === lemmaTextEdition.slug) return selectedClass;
	return normalClass;
};

/*
	BEGIN EditionTabs
*/
const EditionTabs = ({ lemmaText, selectedLemmaEdition, toggleEdition }) => (
	<div className="version-tabs tabs">
		{lemmaText.map((lemmaTextEdition, index) => {
			const lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);

			return (
				<RaisedButton
					key={lemmaTextEdition.slug}
					label={lemmaEditionTitle}
					data-edition={lemmaTextEdition.title}
					className={getEditionTabClass(selectedLemmaEdition, lemmaTextEdition, index)}
					onClick={toggleEdition.bind(null, lemmaTextEdition.slug)}
				/>
			);
		})}

	</div>
);

EditionTabs.propTypes = {
	lemmaText: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
	})).isRequired,
	selectedLemmaEdition: PropTypes.string.isRequired,
	toggleEdition: PropTypes.func.isRequired,
};

EditionTabs.defaultProps = {
	lemmaText: [],
};

/*
	END EditionTabs
*/


/*
	BEGIN MetaTabs
*/
const MetaTabs = ({ toggleHighlighting, highlightingVisible }) => (
	<div className="version-tabs tabs">
		{toggleHighlighting &&
			<RaisedButton
				label="Highlighting"
				className="version-tab tab"
				onClick={toggleHighlighting}
				backgroundColor={highlightingVisible ? '#795548' : null}
				labelStyle={highlightingVisible ? {color: '#ffffff'} : null}
			/>}
		{/*
		<FlatButton
			label="Entities"
			className="version-tab tab"
			onClick={this.toggleEntities}
		/>
		<FlatButton
			label="Scansion"
			className="version-tab tab"
			onClick={this.toggleScansion}
		/>
		*/}
	</div>
);
MetaTabs.propTypes = {
	toggleHighlighting: PropTypes.func,
	highlightingVisible: PropTypes.bool.isRequired,
};
MetaTabs.defaultProps = {
	toggleHighlighting: null,
};
/*
	END MetaTabs
*/


/*
	BEGIN ContextPanelTabs
*/
const ContextPanelTabs = ({ lemmaText, selectedLemmaEdition, toggleEdition, toggleHighlighting, highlightingVisible, editor }) => (
	<div className="lemma-panel-tabs">

		<EditionTabs
			lemmaText={lemmaText}
			selectedLemmaEdition={selectedLemmaEdition}
			toggleEdition={toggleEdition}
		/>

		{!editor &&
			<MetaTabs
				toggleHighlighting={toggleHighlighting}
				highlightingVisible={highlightingVisible}
			/>
		}

	</div>
);
ContextPanelTabs.propTypes = {
	lemmaText: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
	})),
	selectedLemmaEdition: PropTypes.string.isRequired,
	toggleEdition: PropTypes.func.isRequired,
	toggleHighlighting: PropTypes.func.isRequired,
	highlightingVisible: PropTypes.bool.isRequired,

	// requiered if editor:
	editor: PropTypes.bool,
};
ContextPanelTabs.defaultProps = {
	editor: false,
};
/*
	BEGIN ContextPanelTabs
*/

export { EditionTabs, MetaTabs };
export default ContextPanelTabs;
