import RaisedButton from 'material-ui/RaisedButton';


/*
	helpers
*/
const getEditionTabClass = (selectedLemmaEdition, lemmaTextEdition, index) => {
	const normalClass = 'edition-tab tab';
	const selectedClass = 'edition-tab tab selected-edition-tab';

	if (!selectedLemmaEdition.length && index === 0) return selectedClass;
	if (selectedLemmaEdition === lemmaTextEdition.slug) return selectedClass;
	return normalClass;
};

/*
	BEGIN EditionTabs
*/
const EditionTabs = ({ lemmaText, selectedLemmaEdition, toggleEdition }) => (
	<div className="edition-tabs tabs">
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
	lemmaText: React.PropTypes.arrayOf(React.PropTypes.shape({
		title: React.PropTypes.string.isRequired,
		slug: React.PropTypes.string.isRequired,
	})).isRequired,
	selectedLemmaEdition: React.PropTypes.string.isRequired,
	toggleEdition: React.PropTypes.func.isRequired,
};
/*
	END EditionTabs
*/


/*
	BEGIN MetaTabs
*/
const MetaTabs = ({ toggleHighlighting, highlightingVisible }) => (
	<div className="edition-tabs tabs">
		{toggleHighlighting &&
			<RaisedButton
				label="Highlighting"
				className="edition-tab tab"
				onClick={toggleHighlighting}
				backgroundColor={highlightingVisible ? '#795548' : null}
				labelStyle={highlightingVisible ? {color: '#ffffff'} : null}
			/>}
		{/*
		<FlatButton
			label="Entities"
			className="edition-tab tab"
			onClick={this.toggleEntities}
		/>
		<FlatButton
			label="Scansion"
			className="edition-tab tab"
			onClick={this.toggleScansion}
		/>
		*/}
	</div>
);
MetaTabs.propTypes = {
	toggleHighlighting: React.PropTypes.func,
	highlightingVisible: React.PropTypes.bool.isRequired,
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
const ContextPanelTabs = ({ lemmaText, selectedLemmaEdition, toggleEdition, toggleHighlighting, highlightingVisible }) => (
	<div className="lemma-panel-tabs">
		
		<EditionTabs
			lemmaText={lemmaText}
			selectedLemmaEdition={selectedLemmaEdition}
			toggleEdition={toggleEdition}
		/>

		<MetaTabs
			toggleHighlighting={toggleHighlighting}
			highlightingVisible={highlightingVisible}
		/>
		
	</div>
);
ContextPanelTabs.propTypes = {
	lemmaText: React.PropTypes.arrayOf(React.PropTypes.shape({
		title: React.PropTypes.string.isRequired,
		slug: React.PropTypes.string.isRequired,
	})).isRequired,
	selectedLemmaEdition: React.PropTypes.string.isRequired,
	toggleEdition: React.PropTypes.func.isRequired,
	toggleHighlighting: React.PropTypes.func.isRequired,
	highlightingVisible: React.PropTypes.bool.isRequired,
};
/*
	BEGIN ContextPanelTabs
*/

export { EditionTabs, MetaTabs };
export default ContextPanelTabs;
