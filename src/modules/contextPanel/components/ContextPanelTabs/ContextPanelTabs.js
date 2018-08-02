import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import _s from 'underscore.string';

// lib
import getVersionTabClass from '../../lib/getVersionTabClass';


const VersionTabs = ({ versions, selectedLemmaVersion, toggleVersion }) => (
	<div className="version-tabs tabs">
		{versions.map((version, index) => {
			const lemmaVersionTitle = _s.truncate(version.title, 20);

			return (
				<RaisedButton
					key={version.slug}
					label={lemmaVersionTitle || ''}
					data-edition={version.title}
					className={getVersionTabClass(selectedLemmaVersion, version, index)}
					onClick={toggleVersion.bind(null, version.id)}
				/>
			);
		})}

	</div>
);

VersionTabs.propTypes = {
	selectedLemmaVersion: PropTypes.object.isRequired,
	toggleVersion: PropTypes.func.isRequired,
};

VersionTabs.defaultProps = {
	versions: [],
};


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
	BEGIN ContextPanelTabs
*/
const ContextPanelTabs = ({ versions, selectedLemmaVersion, toggleVersion, toggleHighlighting, highlightingVisible, editor }) => (
	<div className="lemma-panel-tabs">
		<VersionTabs
			versions={versions}
			selectedLemmaVersion={selectedLemmaVersion}
			toggleVersion={toggleVersion}
		/>
		{/**!editor &&
			<MetaTabs
				toggleHighlighting={toggleHighlighting}
				highlightingVisible={highlightingVisible}
			/>
		*/}
	</div>
);

ContextPanelTabs.propTypes = {
	selectedLemmaVersion: PropTypes.object.isRequired,
	toggleVersion: PropTypes.func.isRequired,
	toggleHighlighting: PropTypes.func.isRequired,
	highlightingVisible: PropTypes.bool.isRequired,

	// requiered if editor:
	editor: PropTypes.bool,
};

ContextPanelTabs.defaultProps = {
	editor: false,
};

export { VersionTabs, MetaTabs };
export default ContextPanelTabs;
