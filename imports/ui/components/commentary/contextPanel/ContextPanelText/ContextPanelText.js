import React from 'react';
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
	} else if (lemmaText && lemmaText.length) {
		selectedEditionText = lemmaText[0];
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
class ContextPanelText extends React.Component {

	constructor(props) {
		super(props);

		this.lines = [];

		// methods:
		this.handeLineMouseEnter = this.handeLineMouseEnter.bind(this);
		this.handeLineMouseLeave = this.handeLineMouseLeave.bind(this);
		this.handleLineClick = this.handleLineClick.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {

		const { selectedLineFrom, selectedLineTo, lineFrom, lineTo } = this.props;

		// hanlde highliting selected lines:
		if (Object.keys(this.lines).length) {
			if (selectedLineFrom === 0) {
				for (let i = lineFrom; i <= lineTo; i += 1) {
					if (i.toString() in this.lines && this.lines[i.toString()] && this.lines[i.toString()].style) {
						this.lines[i.toString()].style.borderBottom = '2px solid #ffffff';
					}
				}
			} else if (selectedLineTo === 0) {
				for (let i = lineFrom; i <= lineTo; i += 1) {
					if (i.toString() in this.lines && this.lines[i.toString()] && this.lines[i.toString()].style) {
						if (i === selectedLineFrom) {
							this.lines[i.toString()].style.borderBottom = '2px solid #B2EBF2';
						} else if (i.toString() in this.lines) {
							this.lines[i.toString()].style.borderBottom = '2px solid #ffffff';
						}
					}
				}
			} else {
				for (let i = lineFrom; i <= lineTo; i += 1) {
					if (i.toString() in this.lines && this.lines[i.toString()] && this.lines[i.toString()].style) {
						if (i >= selectedLineFrom && i <= selectedLineTo) {
							this.lines[i.toString()].style.borderBottom = '2px solid #B2EBF2';
						} else if (i.toString() in this.lines) {
							this.lines[i.toString()].style.borderBottom = '2px solid #ffffff';
						}
					}
				}
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
		if (!this.props.disableEdit) {

			const { selectedLineFrom, selectedLineTo, updateSelectedLines } = this.props;

			const target = event.target;
			const id = parseInt(target.id, 10);
			if (selectedLineFrom === 0) {
				updateSelectedLines(id, null);
			} else if (id === selectedLineFrom && selectedLineTo === 0) {
				updateSelectedLines(0, null);
			} else if (selectedLineTo === 0 && id > selectedLineFrom) {
				updateSelectedLines(null, id);
			} else if (selectedLineTo === 0 && id < selectedLineFrom) {
				updateSelectedLines(id, selectedLineFrom);
			} else {
				updateSelectedLines(id, 0);
			}
		}
	}
	/*
		END editor methods:
	*/

	render() {
		const { onBeforeClicked, selectedLemmaEdition, highlightingVisible, lineFrom, commentGroup, onAfterClicked, maxLine, lemmaText, disableEdit, selectedLineFrom, selectedLineTo, updateSelectedLines, editor } = this.props;

		const selectedEditionText = getSelectedEditionText(lemmaText, selectedLemmaEdition);

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

										<LineNumbering
											n={line.n}
											section={line.section}
										/>
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
										id={line.n}
										ref={(component) => { this.lines[(line.n).toString()] = component; }}
										dangerouslySetInnerHTML={{ __html: line.html }}
										onMouseEnter={this.handeLineMouseEnter}
										onMouseLeave={this.handeLineMouseLeave}
										onClick={this.handleLineClick}
										style={!disableEdit ? { cursor: 'pointer' } : null}
									/>

									<LineNumbering n={line.n} section={line.section} />
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

									<LineNumbering n={line.n} section={line.section} />
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
	lineFrom: PropTypes.number.isRequired,
	lineTo: PropTypes.number,
	onBeforeClicked: PropTypes.func.isRequired,
	onAfterClicked: PropTypes.func.isRequired,
	selectedLemmaEdition: PropTypes.string.isRequired,
	lemmaText: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
		lines: PropTypes.arrayOf(PropTypes.shape({
			n: PropTypes.number.isRequired,
			html: PropTypes.string.isRequired,
		}))
	})).isRequired,
	commentGroup: PropTypes.shape({
		lineFrom: PropTypes.number.isRequired,
		lineTo: PropTypes.number,
	}),
	maxLine: PropTypes.number,
	highlightingVisible: PropTypes.bool,

	// requiered if editor:
	disableEdit: PropTypes.bool,
	selectedLineFrom: PropTypes.number,
	selectedLineTo: PropTypes.number,
	updateSelectedLines: PropTypes.func,
	editor: PropTypes.bool,
};

ContextPanelText.defaultProps = {
	commentGroup: null,

	disableEdit: false,
	selectedLineFrom: 0,
	selectedLineTo: 0,
	updateSelectedLines: null,
	editor: false,
};
/*
	END ContextPanelText
*/

export default ContextPanelText;
