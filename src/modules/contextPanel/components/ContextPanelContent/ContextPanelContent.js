import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';

// components
import ContextPanelText from '../ContextPanelText';
import ContextPanelTabs from '../ContextPanelTabs';

// lib
import getContextPanelStyles from '../../lib/getContextPanelStyles';


class ContextPanelContent extends React.Component {
	render() {
		const {
			open, highlightingVisible, closeContextPanel, onBeforeClicked,
			onAfterClicked, selectedLemmaVersion, commentGroup, maxLine, disableEdit,
			selectedLineFrom, selectedLineTo, updateSelectedLemma, editor, versions,
			toggleVersion, toggleHighlighting,
		} = this.props;

		if (!selectedLemmaVersion) {
			// TODO: loading state
			return null;
		}

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
					selectedLemmaVersion={selectedLemmaVersion}
					commentGroup={commentGroup}
					maxLine={maxLine}
					highlightingVisible={highlightingVisible}
					disableEdit={disableEdit}
					selectedLineFrom={selectedLineFrom}
					selectedLineTo={selectedLineTo}
					updateSelectedLemma={updateSelectedLemma}
					editor={editor}
				/>

				<ContextPanelTabs
					selectedLemmaVersion={selectedLemmaVersion}
					versions={versions}
					toggleVersion={toggleVersion}
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
	highlightingVisible: PropTypes.bool.isRequired,
	onBeforeClicked: PropTypes.func.isRequired,
	onAfterClicked: PropTypes.func.isRequired,
	maxLine: PropTypes.number.isRequired,
	open: PropTypes.bool,
	commentGroup: PropTypes.object,
	closeContextPanel: PropTypes.func,
	filters: PropTypes.array,
	// toggleHighlighting: PropTypes.func.isRequired,

	// editor:
	disableEdit: PropTypes.bool,
	selectedLineFrom: PropTypes.number,
	selectedLineTo: PropTypes.number,
	updateSelectedLemma: PropTypes.func,
	editor: PropTypes.bool,
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
