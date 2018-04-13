import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import autoBind from 'react-autobind';
import parseLiteralUrn from '../../../cts/lib/parseUrn';

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

		autoBind(this);
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
				this.textNodes[(i - 1).toString()].style.borderBottom = '2px solid #B2EBF2';
			} else {
				this.textNodes[(i - 1).toString()].style.borderBottom = '';
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
		const { updateSelectedLemma } = this.props;

		if (
			!this.props.disableEdit
      && anchorOffset !== extentOffset
      && anchorNode
			&& extentNode
      && anchorNode.parentElement
      && extentNode.parentElement
		) {
			const selectedLemma = {
				passageFrom: parseLiteralUrn(anchorNode.parentElement.dataset.urn),
				passageTo: parseLiteralUrn(extentNode.parentElement.dataset.urn),
				subreferenceIndexFrom: anchorOffset,
				subreferenceIndexTo: extentOffset,
			};

			updateSelectedLemma(selectedLemma);
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
										ref={(component) => { this.textNodes[(i).toString()] = component; }}
										dangerouslySetInnerHTML={{ __html: textNode.text }}
										style={!disableEdit ? { cursor: 'pointer' } : null}
										onMouseUp={this.handleSelectingTextForComment}
										data-id={textNode.id}
										data-urn={textNode.urn}
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
	updateSelectedLemma: PropTypes.func,
	editor: PropTypes.bool,
};

ContextPanelText.defaultProps = {
	commentGroup: null,

	disableEdit: false,
	updateSelectedLemma: null,
	editor: false,
};
/*
	END ContextPanelText
*/

export default ContextPanelText;
