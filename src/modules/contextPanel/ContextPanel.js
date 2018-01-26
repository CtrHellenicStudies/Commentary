
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
import { getMaxLineMutation } from '../../graphql/methods/textNodes';

// private component:
import ContextPanelContent from './panel/ContextPanelContent';
import Utils from '../../lib/utils';



/*
	helpers
*/
const getWorkSlug = (props) => {
	if (props.commentGroup) return props.commentGroup.work.slug;
	if (props.workSlug) return props.workSlug;
	throw new Error('commentGroup or workSlug missing in ContextPanel component - one of two is requierd');
};

const LINE_THRESHOLD = 25;


class ContextPanel extends Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedLemmaEdition: '',
			lineFrom: props.passageFrom,
			maxLine: 0,
			highlightingVisible: false,
			lemmaCitation: Utils.createLemmaCitation('tlg001', 0, 49)
		};

		this.setMaxLine();

		// methods:
		this.onAfterClicked = this.onAfterClicked.bind(this);
		this.onBeforeClicked = this.onBeforeClicked.bind(this);
		this.toggleEdition = this.toggleEdition.bind(this);
		this.toggleHighlighting = this.toggleHighlighting.bind(this);
		this.scrollElement = this.scrollElement.bind(this);
		this.setMaxLine = this.setMaxLine.bind(this);
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
		if (prevProps.workSlug !== this.props.workSlug || prevProps.subworkN !== this.props.subworkN) {
			this.setMaxLine();
		}
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

	setMaxLine() {

		const that = this;
		const workSlug = getWorkSlug(this.props);
		const subworkN = 1;
		this.props.getMaxLine(workSlug, subworkN).then(function(res) {
			that.setState({
				maxLine: parseInt(res.data.getMaxLine, 10),
			});
		});
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
		let lemmaCitation;
		if (nextProps.commentGroup) {
			lemmaCitation = nextProps.commentGroup.comments[0].lemmaCitation;
		} else if (nextProps.lemmaCitation) {
			lemmaCitation = nextProps.lemmaCitation;
		} else {
			lemmaCitation = Utils.createLemmaCitation('tlg001', 0, 49);
		}
		this.setState({
			lemmaCitation: lemmaCitation
		});
	}
	componentWillUnmount() {
		if (this.timeouts) {
			this.timeouts.forEach(clearTimeout);
		}
	}

	render() {

		const { open, passageFrom, closeContextPanel, commentGroup, disableEdit, selectedLineFrom, selectedLineTo, updateSelectedLines, editor, multiline } = this.props;
		const { highlightingVisible, maxLine, selectedLemmaEdition, lemmaCitation } = this.state;

		const workSlug = getWorkSlug(this.props);

		return (
			<ContextPanelContent
				open={open}
				closeContextPanel={closeContextPanel}
				workSlug={workSlug}
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

				disableEdit={disableEdit}
				selectedLineFrom={selectedLineFrom}
				selectedLineTo={selectedLineTo}
				updateSelectedLines={updateSelectedLines}
				editor={editor}
				multiline={multiline}
			/>
		);
	}
}
ContextPanel.propTypes = {
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
	commentLemmaIndex: PropTypes.string,
	getMaxLine: PropTypes.func,

	// requiered if editor:
	disableEdit: PropTypes.bool,
	selectedLineFrom: PropTypes.number,
	selectedLineTo: PropTypes.number,
	updateSelectedLines: PropTypes.func,
	workSlug: PropTypes.string,
	subworkN: PropTypes.number,
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
	workSlug: null,
	subworkN: null,
	editor: false,
};
export default compose(getMaxLineMutation)(ContextPanel);
