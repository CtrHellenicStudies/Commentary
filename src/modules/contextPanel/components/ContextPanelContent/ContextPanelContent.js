import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';

// components:
import ContextPanelText from '../ContextPanelText/ContextPanelText';

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


class ContextPanelContent extends React.Component {
	constructor(props) {
		super(props);
		const { lineFrom } = props;

		this.state = {
			lineTo: lineFrom + 49
		};
	}

	render() {
		const {
			open, highlightingVisible, closeContextPanel, onBeforeClicked,
			onAfterClicked, selectedLemmaVersion, commentGroup, maxLine, disableEdit,
			selectedLineFrom, selectedLineTo, updateSelectedLemma, editor,
		} = this.props;
		const { lemmaText } = this.state;

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

				{selectedLemmaVersion &&
					<ContextPanelText
						onBeforeClicked={onBeforeClicked}
						onAfterClicked={onAfterClicked}
						selectedLemmaVersion={selectedLemmaVersion}
						lemmaText={lemmaText}
						commentGroup={commentGroup}
						maxLine={maxLine}
						highlightingVisible={highlightingVisible}
						disableEdit={disableEdit}
						selectedLineFrom={selectedLineFrom}
						selectedLineTo={selectedLineTo}
						updateSelectedLemma={updateSelectedLemma}
						editor={editor}
					/>
				}

				{/*
				<ContextPanelTabs
					lemmaText={lemmaText}
					selectedLemmaVersion={selectedLemmaVersion}
					toggleVersion={toggleVersion}
					toggleHighlighting={toggleHighlighting}
					highlightingVisible={highlightingVisible}
					disableEdit={disableEdit}
					editor={editor}
				/>
				*/}

			</div>
		);
	}
}

ContextPanelContent.propTypes = {
	open: PropTypes.bool,
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
	filters: PropTypes.array,
	highlightingVisible: PropTypes.bool.isRequired,
	onBeforeClicked: PropTypes.func.isRequired,
	onAfterClicked: PropTypes.func.isRequired,
	lineFrom: PropTypes.number,
	lineTo: PropTypes.number,
	maxLine: PropTypes.number.isRequired,
	// toggleHighlighting: PropTypes.func.isRequired,

	// requiered if editor:
	disableEdit: PropTypes.bool,
	selectedLineFrom: PropTypes.number,
	selectedLineTo: PropTypes.number,
	updateSelectedLemma: PropTypes.func,
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
	updateSelectedLemma: null,
	editor: false,
};

export default ContextPanelContent;
