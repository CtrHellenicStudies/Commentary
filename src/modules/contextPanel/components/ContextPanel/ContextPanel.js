import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import $ from 'jquery';
import autoBind from 'react-autobind';

// graphql
import getMaxLineMutation from '../../../textNodes/graphql/mutations/getMaxLine';

// private component:
import ContextPanelContentContainer from '../../containers/ContextPanelContentContainer';

// lib
import getCurrentSubdomain from '../../../../lib/getCurrentSubdomain';
import serializeUrn from '../../../cts/lib/serializeUrn';
import defaultWorksEditions from '../../../comments/lib/defaultWorksEditions';



const LINE_THRESHOLD = 25;



class ContextPanel extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedLemmaVersionIndex: null,
			lineFrom: props.passageFrom,
			maxLine: 0,
			highlightingVisible: false,
		};

		autoBind(this);
	}

	componentDidMount() {
		this.scrollElement('open');
	}

	componentDidUpdate(prevProps, prevState) {
		const isLemmaVersionChange = prevState.selectedLemmaVersion !== this.state.selectedLemmaVersion;
		const isHighlightingChange = prevState.highlightingVisible !== this.state.highlightingVisible;
		if (!(isLemmaVersionChange || isHighlightingChange)) {
			this.scrollElement('open');
		}
		// if work or subwork updated - update maxline
	}

	onAfterClicked() {
		if ((this.state.lineFrom + 49) <= this.state.maxLine) {
			this.setState({
				lineFrom: this.state.lineFrom + LINE_THRESHOLD,
			});
		}
	}

	onBeforeClicked() {
		const { lineFrom } = this.state;

		if (lineFrom >= LINE_THRESHOLD) {
			this.setState({
				lineFrom: lineFrom - LINE_THRESHOLD,
			});
		} else if (lineFrom !== 1) {
			this.setState({
				lineFrom: 1,
			});
		}
	}

	scrollElement(state) {
		if (!this.props.editor) {
			switch (state) {
			case 'open':
				window.requestAnimationFrame(() => {
					setTimeout(() => {
						const scroll = $(`#comment-group-${this.props.commentLemmaIndex}`).offset().top;
						$(document).scrollTop(scroll);
					}, 300);
				});
				break;
			case 'close':
				window.requestAnimationFrame(() => {
					setTimeout(() => {
						const scroll = $(`#comment-group-${this.props.commentLemmaIndex}`).offset().top;
						$(document).scrollTop(scroll);
					}, 1000);
				});
				break;
			default:
				break;
			}
		}
	}

	render() {
		const {
			open, closeContextPanel, commentGroup, disableEdit, selectedLineFrom,
			selectedLineTo, updateSelectedLemma, editor, multiline, filters,
		} = this.props;

		const { maxLine } = this.state;

		const subdomain = getCurrentSubdomain();

		let textNodesUrn = 'urn:cts:greekLit:tlg0012.tlg001';

		if (defaultWorksEditions[subdomain]) {
			textNodesUrn = defaultWorksEditions.defaultWorkUrn;
		}

		if(commentGroup && commentGroup.lemmaCitation) {
			const lemmaCitationTemp = commentGroup.lemmaCitation;
			let newPassageTo = [];
			if (
				lemmaCitationTemp.passageFrom.length
				&& lemmaCitationTemp.passageTo.length
			) {
				newPassageTo = lemmaCitationTemp.passageTo.slice();
				newPassageTo[newPassageTo.length - 1] = lemmaCitationTemp.passageFrom[lemmaCitationTemp.passageFrom.length - 1] + 49;
			}
			textNodesUrn = serializeUrn({
				...lemmaCitationTemp,
				passageTo: newPassageTo,
			});
		}

		return (
			<ContextPanelContentContainer
				disableEdit={disableEdit}
				open={open}
				filters={filters}
				closeContextPanel={closeContextPanel}
				maxLine={maxLine}
				selectedLineFrom={selectedLineFrom}
				selectedLineTo={selectedLineTo}
				updateSelectedLemma={updateSelectedLemma}
				onBeforeClicked={this.onBeforeClicked}
				onAfterClicked={this.onAfterClicked}
				editor={editor}
				multiline={multiline}
				textNodesUrn={textNodesUrn}
			/>
		);
	}
}

ContextPanel.propTypes = {
	open: PropTypes.bool,
	closeContextPanel: PropTypes.func,
	commentLemmaIndex: PropTypes.string,
	getMaxLine: PropTypes.func,
	filters: PropTypes.array,
	disableEdit: PropTypes.bool,
	selectedLineFrom: PropTypes.number,
	selectedLineTo: PropTypes.number,
	updateSelectedLemma: PropTypes.func,
	editor: PropTypes.bool,
	lineFrom: PropTypes.number,
	multiline: PropTypes.string,
};

ContextPanel.defaultProps = {
	commentGroup: null,
	closeContextPanel: null,
	commentLemmaIndex: null,

	disableEdit: false,
	selectedLineFrom: 0,
	selectedLineTo: 0,
	updateSelectedLemma: null,
	editor: false,
};

export default compose(getMaxLineMutation)(ContextPanel);
