
/*
	HOW TO USE:

	1. Used to show selected lines for commentGroup:
	- props to be set:


	2. Used to select lines to be commented in editor:
	- props to be set:


*/

import React from 'react';
import { Meteor } from 'meteor/meteor';

// private component:
import ContextPanelContent from './ContextPanelContent';


/*
	helpers
*/
const getLineFrom = (props) => {
	if (props.commentGroup) return props.commentGroup.lineFrom;
	if (props.workSlug) return props.lineFrom;
	throw new Meteor.Error('commentGroup or lineFrom missing in ContextPanel component - one of two is requierd');
};
const getWorkSlug = (props) => {
	if (props.commentGroup) return props.commentGroup.work.slug;
	if (props.workSlug) return props.workSlug;
	throw new Meteor.Error('commentGroup or workSlug missing in ContextPanel component - one of two is requierd');
};
const getsubworkN = (props) => {
	if (props.commentGroup) return props.commentGroup.subwork.n;
	if (props.subworkN) return props.subworkN;
	throw new Meteor.Error('commentGroup or subworkN missing in ContextPanel component - one of two is requierd');
};

const LINE_THRESHOLD = 25;


class ContextPanel extends React.Component {
	static propTypes = {
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
		commentLemmaIndex: React.PropTypes.string,

		// requiered if editor:
		disableEdit: React.PropTypes.bool,
		selectedLineFrom: React.PropTypes.number,
		selectedLineTo: React.PropTypes.number,
		updateSelectedLines: React.PropTypes.func,
		workSlug: React.PropTypes.string,
		subworkN: React.PropTypes.number,
		editor: React.PropTypes.bool,
		lineFrom: React.PropTypes.number,
	};

	static defaultProps = {
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
	}

	constructor(props) {
		super(props);

		this.state = {
			selectedLemmaEdition: '',
			lineFrom: getLineFrom(props),
			maxLine: 0,
			highlightingVisible: true,
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

		const workSlug = getWorkSlug(this.props);
		const subworkN = getsubworkN(this.props);

		Meteor.call('getMaxLine', workSlug, subworkN, (err, res) => {
			if (err) throw new Meteor.Erorr(err);
			this.setState({
				maxLine: res,
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
		if (this.props.lineFrom) {
			this.setState({
				lineFrom: nextProps.lineFrom
			});
		}
	}

	render() {

		const { open, closeContextPanel, commentGroup, disableEdit, selectedLineFrom, selectedLineTo, updateSelectedLines, editor } = this.props;
		const { highlightingVisible, lineFrom, maxLine, selectedLemmaEdition } = this.state;

		const workSlug = getWorkSlug(this.props);
		const subworkN = getsubworkN(this.props);

		return (
			<ContextPanelContent
				open={open}
				closeContextPanel={closeContextPanel}
				workSlug={workSlug}
				subworkN={subworkN}
				commentGroup={commentGroup}
				highlightingVisible={highlightingVisible}
				lineFrom={lineFrom}
				maxLine={maxLine}
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
			/>
		);
	}
}

export default ContextPanel;
