import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

/*
	BEGIN helpers
*/
const getSelectedVersionText = (lemmaText, selectedLemmaVersion) => {
	let selectedVersionText = { textNodes: [], slug: '', title: '' };
	if (selectedLemmaVersion && selectedLemmaVersion.length) {
		lemmaText.forEach((edition) => {
			if (edition.slug === selectedLemmaVersion) {
				selectedVersionText = edition;
			}
		});
	} else if (lemmaText && lemmaText.length && lemmaText[0].length) {
		selectedVersionText.title = lemmaText[0][0].version.title;
		selectedVersionText.slug = lemmaText[0][0].version.slug;
		lemmaText[0].forEach(textNode => {
			selectedVersionText.textNodes.push({
				n: textNode.location[0],
				html: textNode.text,
			});
		});
	}
	return selectedVersionText;
};

const getTextNodeClass = (textNodeFrom, textNodeTo, n, highlightingVisible) => {
	let usedLineTo = textNodeFrom;

	if (textNodeTo) {
		usedLineTo = textNodeTo;
	}

	let textNodeClass = 'lemma-textNode';
	if (textNodeFrom <= n && n <= usedLineTo && highlightingVisible) {
		textNodeClass += ' highlighted';
	}
	return textNodeClass;
};

const getContextPanelTextState = (commentGroup, editor) => {
	if (commentGroup) return 'context for comment group';
	if (editor) return 'editor';
	return 'default';
};
/*
	END helpers
*/


/*
	BEGIN LineNumbering
*/
const LineNumbering = ({ location }) => {
	const n = location[location.length - 1];

	return (
		<div className="lemma-meta">
			<span
				className={`lemma-textNode-n ${
					(n % 5 === 0 || n === 1) ? 'lemma-textNode-n--displayed' : ''
				}`}
			>
				{n}
			</span>
		</div>
	);
}

LineNumbering.propTypes = {
	location: PropTypes.array.isRequired,
};
/*
	END LineNumbering
*/


/*
	BEGIN ContextPanelText
*/
class ContextPanelText extends Component {

	constructor(props) {
		super(props);

		this.textNodes = [];
		this.state = {
			selectedLineFrom: 0,
			selectedLineTo: 0
		}

		// methods:
		this.updateBorderLines = this.updateBorderLines.bind(this);
	}

	updateBorderLines(textNodeFrom, textNodeTo) {
		// hanlde highliting selected textNodes:
		let _textNodeTo = textNodeTo;
		if(textNodeTo === 0) {
			_textNodeTo = textNodeFrom + 1;
		}
		if(!Object.keys(this.textNodes).length) {
			return;
		}
		for (let i = 1; i <= Object.keys(this.textNodes).length; i += 1) {
			if (i > textNodeFrom && i <= _textNodeTo) {
				this.textNodes[(i-1).toString()].style.borderBottom = '2px solid #B2EBF2';
			} else {
				this.textNodes[(i-1).toString()].style.borderBottom = '';
			}
		}
	}

	/*
		BEGIN editor methods:
	*/

	handleSelectingTextForComment(e) {
		const target = e.target;
		const selObj = window.getSelection();
		const { anchorNode, extentNode, anchorOffset, extentOffset } = selObj;

		if (
			!this.props.disableEdit
      && anchorOffset !== extentOffset
      && anchorNode && extentNode
      && anchorNode.parentElement
      && extentNode.parentElement
      && anchorNode.parentElement.className === extentNode.parentElement.className
		) {
			const selectedLines = getSelectedVersionText(this.props.lemmaText, this.props.selectedLemmaVersion).textNodes;

			const { updateSelectedLines } = this.props;
			const { selectedLineFrom, selectedLineTo } = this.state;

			let textNodesToUpdate;
			const id = parseInt(target.id, 10);

			if (selectedLineTo === 0 && id > selectedLineFrom && selectedLineFrom !== 0) {
				textNodesToUpdate = selectedLines.slice(selectedLineFrom, id+1);
				this.setState({selectedLineTo : id});
				this.updateBorderLines(selectedLineFrom, id + 1);
			} else if (selectedLineTo === 0 && id < selectedLineFrom) {
				textNodesToUpdate = selectedLines.slice(id, id + 1);
				this.setState({selectedLineFrom: id});
				this.updateBorderLines(id, id + 1);
			} else {
				textNodesToUpdate = selectedLines.slice(id, id + 1);
				this.setState({
					selectedLineFrom: id,
					selectedLineTo: 0});
				this.updateBorderLines(id, 0);
			}
			updateSelectedLines({
				textNodes: textNodesToUpdate,
			});

		}
	}
	/*
		END editor methods:
	*/

	render() {
		const {
			onBeforeClicked, selectedLemmaVersion, highlightingVisible, textNodeFrom,
			commentGroup, onAfterClicked, maxLine, disableEdit, editor,
		} = this.props;


		const contextPanelTextState = getContextPanelTextState(commentGroup, editor);

		return (
			<div className="lemma-text-wrap">
				{textNodeFrom > 1 ?
					<div className="before-link">
						<RaisedButton
							className="light"
							label="Previous"
							onClick={onBeforeClicked}
							icon={<i className="mdi mdi-chevron-up" />}
						/>
					</div>
					: '' }

				{(() => {
					switch (contextPanelTextState) {
					case 'context for comment group':
						return (
							selectedLemmaVersion.textNodes.map((textNode, i) => {
								const textNodeClass = getTextNodeClass(commentGroup.textNodeFrom, commentGroup.textNodeTo, textNode.id, highlightingVisible);

								return (
									<div
										className={textNodeClass}
										key={`${textNode.id}-${i}`}
									>
										<div
											className="lemma-text"
											dangerouslySetInnerHTML={{ __html: textNode.text }}
										/>

										<LineNumbering location={textNode.location} />
									</div>
								);
							})
						);
					case 'editor':
						return (
							selectedLemmaVersion.textNodes.map((textNode, i) => (
								<div
									className="lemma-textNode"
									key={`${textNode.id}-${i}`}
								>
									<div
										className="lemma-text"
										id={textNode.id}
										ref={(component) => { this.textNodes[(i).toString()] = component; }}
										dangerouslySetInnerHTML={{ __html: textNode.text }}
										onClick={this.handleLineClick}
										style={!disableEdit ? { cursor: 'pointer' } : null}
										onMouseUp={this.handleSelectingTextForVariant}
									/>

									<LineNumbering location={textNode.location} />
								</div>
							))
						);
					default:
						return (
							selectedLemmaVersion.textNodes.map((textNode, i) => (
								<div
									className="lemma-textNode"
									key={`${textNode.id}-${i}`}
								>
									<div
										className="lemma-text"
										dangerouslySetInnerHTML={{ __html: textNode.text }}
									/>

									<LineNumbering location={textNode.location} />
								</div>
							))
						);
					}
				})()}

				{textNodeFrom < maxLine ?
					<div className="after-link">
						<RaisedButton
							className="light"
							label="Next"
							onClick={onAfterClicked}
							icon={<i className="mdi mdi-chevron-down" />}
						/>
					</div>
					: '' }
			</div>
		);
	}
}

ContextPanelText.propTypes = {
	textNodeFrom: PropTypes.number,
	textNodeTo: PropTypes.number,
	onBeforeClicked: PropTypes.func.isRequired,
	onAfterClicked: PropTypes.func.isRequired,
	selectedLemmaVersion: PropTypes.object.isRequired,
	commentGroup: PropTypes.shape({
		textNodeFrom: PropTypes.number.isRequired,
		textNodeTo: PropTypes.number,
	}),
	maxLine: PropTypes.number,
	highlightingVisible: PropTypes.bool,

	// requiered if editor:
	disableEdit: PropTypes.bool,
	updateSelectedLines: PropTypes.func,
	editor: PropTypes.bool,
};

ContextPanelText.defaultProps = {
	commentGroup: null,

	disableEdit: false,
	updateSelectedLines: null,
	editor: false,
};
/*
	END ContextPanelText
*/

export default ContextPanelText;
