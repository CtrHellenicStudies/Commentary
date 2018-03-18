import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

/*
	BEGIN helpers
*/
const getSelectedEditionText = (lemmaText, selectedLemmaEdition) => {
	let selectedEditionText = { lines: [], slug: '', title: '' };
	if (selectedLemmaEdition && selectedLemmaEdition.length) {
		lemmaText.forEach((edition) => {
			if (edition.slug === selectedLemmaEdition) {
				selectedEditionText = edition;
			}
		});
	} else if (lemmaText && lemmaText.length && lemmaText[0].length) {
		selectedEditionText.title = lemmaText[0][0].version.title;
		selectedEditionText.slug = lemmaText[0][0].version.slug;
		lemmaText[0].forEach(textNode => {
			selectedEditionText.lines.push({
				n: textNode.location[0],
				html: textNode.text,		
			});
		});
	}
	return selectedEditionText;
};

const getLineClass = (lineFrom, lineTo, n, highlightingVisible) => {
	let usedLineTo = lineFrom;

	if (lineTo) {
		usedLineTo = lineTo;
	}

	let lineClass = 'lemma-line';
	if (lineFrom <= n && n <= usedLineTo && highlightingVisible) {
		lineClass += ' highlighted';
	}
	return lineClass;
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
const LineNumbering = ({ n }) => (
	<div className="lemma-meta">
		<span
			className={`lemma-line-n ${
			(n % 5 === 0 || n === 1) ? 'lemma-line-n--displayed' : ''
		}`}
		>
			{n}
		</span>
	</div>
);

LineNumbering.propTypes = {
	n: PropTypes.number.isRequired,
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

		this.lines = [];
		this.state = {
			selectedLineFrom: 0,
			selectedLineTo: 0
		}

		// methods:
		this.handeLineMouseEnter = this.handeLineMouseEnter.bind(this);
		this.handeLineMouseLeave = this.handeLineMouseLeave.bind(this);
		this.handleLineClick = this.handleLineClick.bind(this);
		this.updateBorderLines = this.updateBorderLines.bind(this);
	}

	updateBorderLines(lineFrom, lineTo) {
		// hanlde highliting selected lines:
		let _lineTo = lineTo;
		if(lineTo === 0) {
			_lineTo = lineFrom + 1;
		}
		if(!Object.keys(this.lines).length) {
			return;
		}
		for (let i = 1; i <= Object.keys(this.lines).length; i += 1) {
			if (i > lineFrom && i <= _lineTo) {
				this.lines[(i-1).toString()].style.borderBottom = '2px solid #B2EBF2';
			} else  {
				this.lines[(i-1).toString()].style.borderBottom = '';
			}
		}
	}

	/*
		BEGIN editor methods:
	*/
	handeLineMouseEnter(event) {
		if (!this.props.disableEdit) {
			const style = event.target.style;
			style.backgroundColor = '#E0F7FA';
		}
	}

	handeLineMouseLeave(event) {
		if (!this.props.disableEdit) {
			const style = event.target.style;
			style.backgroundColor = '#ffffff';
		}
	}

	handleLineClick(event) {
		console.log('I am here');
		 if (!this.props.disableEdit) {

		 	const selectedLines = getSelectedEditionText(this.props.lemmaText, this.props.selectedLemmaEdition).lines;

			 const { updateSelectedLines } = this.props;
			 const { selectedLineFrom, selectedLineTo } = this.state;

		 	const target = event.target;
		 	let textNodesToUpdate;
			 const id = parseInt(target.id, 10);
			 console.log(selectedLines);
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
			updateSelectedLines({lines: textNodesToUpdate});
		}
	}
	/*
		END editor methods:
	*/

	render() {
		const { onBeforeClicked, selectedLemmaEdition, highlightingVisible, lineFrom, commentGroup, onAfterClicked, maxLine, lemmaText, disableEdit, editor } = this.props;

		

		const contextPanelTextState = getContextPanelTextState(commentGroup, editor);

		return (
			<div className="lemma-text-wrap">
				{lineFrom > 1 ?
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
					const selectedEditionText = getSelectedEditionText(lemmaText, selectedLemmaEdition);
					switch (contextPanelTextState) {
					case 'context for comment group':
						return (
							selectedEditionText.lines.map((line, i) => {
								const lineClass = getLineClass(commentGroup.lineFrom, commentGroup.lineTo, line.n, highlightingVisible);

								return (
									<div
										className={lineClass}
										key={`${line.n}-${i}`}
									>
										<div
											className="lemma-text"
											dangerouslySetInnerHTML={{ __html: line.html }}
										/>

										<LineNumbering n={line.n} />
									</div>
								);
							})
						);
					case 'editor':
						return (
							selectedEditionText.lines.map((line, i) => (
								<div
									className="lemma-line"
									key={`${line.n}-${i}`}
								>
									<div
										className="lemma-text"
										id={i}
										ref={(component) => { this.lines[(i).toString()] = component; }}
										dangerouslySetInnerHTML={{ __html: line.html }}
										onMouseEnter={this.handeLineMouseEnter}
										onMouseLeave={this.handeLineMouseLeave}
										onClick={this.handleLineClick}
										style={!disableEdit ? { cursor: 'pointer' } : null}
									/>

									<LineNumbering n={line.n} />
								</div>
							))
						);
					default:
						return (
							selectedEditionText.lines.map((line, i) => (
								<div
									className="lemma-line"
									key={`${line.n}-${i}`}
								>
									<div
										className="lemma-text"
										dangerouslySetInnerHTML={{ __html: line.html }}
									/>

									<LineNumbering n={line.n} />
								</div>
							))
						);
					}
				})()}

				{lineFrom < maxLine ?
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
	lineFrom: PropTypes.number,
	lineTo: PropTypes.number,
	onBeforeClicked: PropTypes.func.isRequired,
	onAfterClicked: PropTypes.func.isRequired,
	selectedLemmaEdition: PropTypes.string.isRequired,
	commentGroup: PropTypes.shape({
		lineFrom: PropTypes.number.isRequired,
		lineTo: PropTypes.number,
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