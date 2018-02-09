
/*
	HOW TO USE:

	1. Used to show selected lines for commentGroup:
	- props to be set:


	2. Used to select lines to be commented in editor:
	- props to be set:


*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import $ from 'jquery';

// graphql
import getMaxLineMutation from '../../../textNodes/graphql/mutations/getMaxLine';

// private component:
import ContextPanelContent from '../ContextPanelContent/ContextPanelContent';

// lib
import Utils from '../../../../lib/utils';
import serializeUrn from '../../../cts/lib/serializeUrn';


/*
	helpers
*/
function setLemmaCitation(commentGroup, _lemmaCitation) {
	let lemmaCitation;
	if (commentGroup) {
		lemmaCitation = commentGroup.comments[0].lemmaCitation;
	} else if (_lemmaCitation) {
		lemmaCitation = _lemmaCitation;
	} else {
		lemmaCitation = Utils.createLemmaCitation('tlg001', 0, 49);
	}
	return lemmaCitation;
}
const LINE_THRESHOLD = 25;


class ContextPanel extends Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedLemmaEdition: '',
			lineFrom: props.passageFrom,
			maxLine: 0,
			highlightingVisible: false,
			lemmaCitation: setLemmaCitation(props.commentGroup, props.lemmaCitation)
		};


		// methods:
		this.onAfterClicked = this.onAfterClicked.bind(this);
		this.onBeforeClicked = this.onBeforeClicked.bind(this);
		this.toggleEdition = this.toggleEdition.bind(this);
		this.toggleHighlighting = this.toggleHighlighting.bind(this);
		this.scrollElement = this.scrollElement.bind(this);
	}

	componentDidMount() {
		this.scrollElement('open');
	}

	componentDidUpdate(prevProps, prevState) {
		const isLemmaEditionChange = prevState.selectedLemmaEdition !== this.state.selectedLemmaEdition;
		const isHighlightingChange = prevState.highlightingVisible !== this.state.highlightingVisible;
		if (!(isLemmaEditionChange || isHighlightingChange)) {
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


	toggleEdition(editionSlug) {
		if (this.state.selectedLemmaEdition !== editionSlug) {
			this.setState({
				selectedLemmaEdition: editionSlug,
			});
		}
	}

	toggleHighlighting() {
		this.setState({
			highlightingVisible: !this.state.highlightingVisible,
		});
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

	componentWillReceiveProps(nextProps) {
		this.setState({
			lemmaCitation: setLemmaCitation(nextProps.commentGroup, nextProps.lemmaCitation)
		});
	}
	componentWillUnmount() {
		if (this.timeouts) {
			this.timeouts.forEach(clearTimeout);
		}
	}

	render() {

		const { open, closeContextPanel, commentGroup,
			 	disableEdit, selectedLineFrom, selectedLineTo, updateSelectedLines, editor, multiline,
				textNodes, filters } = this.props;
		const { highlightingVisible, maxLine, selectedLemmaEdition, lemmaCitation } = this.state;
		let textNodesUrn = 'urn:cts:greekLit:tlg0013.tlg001:1.1-2.1';
		if(commentGroup.lemmaCitation) {
			const lemmaCitationTemp = JSON.parse(JSON.stringify(commentGroup.lemmaCitation));
			lemmaCitationTemp.passageFrom[1] = 1;
			lemmaCitationTemp.passageTo[0] = lemmaCitationTemp.passageTo + 1;
			textNodesUrn = serializeUrn(lemmaCitationTemp);
		}
		return (
			<ContextPanelContent
				open={open}
				filters={filters}
				closeContextPanel={closeContextPanel}
				commentGroup={commentGroup}
				highlightingVisible={highlightingVisible}
				passageFrom={selectedLineFrom}
				passageTo={selectedLineFrom + 49}
				maxLine={maxLine}
				lemmaCitation={lemmaCitation}
				selectedLemmaEdition={selectedLemmaEdition}
				onBeforeClicked={this.onBeforeClicked}
				onAfterClicked={this.onAfterClicked}
				toggleEdition={this.toggleEdition}
				toggleHighlighting={this.toggleHighlighting}
				textNodes={textNodes}
				disableEdit={disableEdit}
				selectedLineFrom={selectedLineFrom}
				selectedLineTo={selectedLineTo}
				updateSelectedLines={updateSelectedLines}
				editor={editor}
				multiline={multiline}
				textNodesUrn={textNodesUrn}
			/>
		);
	}
}
ContextPanel.propTypes = {
	open: PropTypes.bool.isRequired,
	closeContextPanel: PropTypes.func,
	commentLemmaIndex: PropTypes.string,
	getMaxLine: PropTypes.func,
	filters: PropTypes.object,
	disableEdit: PropTypes.bool,
	selectedLineFrom: PropTypes.number,
	selectedLineTo: PropTypes.number,
	updateSelectedLines: PropTypes.func,
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
	updateSelectedLines: null,
	editor: false,
};
export default compose(getMaxLineMutation)(ContextPanel);
