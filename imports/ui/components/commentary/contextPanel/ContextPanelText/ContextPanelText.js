import RaisedButton from 'material-ui/RaisedButton';

const getLineClass = (lineFrom, lineTo, n) => {
	let usedLineTo = lineFrom;

	if (lineTo) {
		usedLineTo = lineTo;
	}

	let lineClass = 'lemma-line';
	if (lineFrom <= n && n <= usedLineTo) {
		lineClass += ' highlighted';
	}
	return lineClass;
};

const ContextPanelText = ({ onBeforeClicked, selectedLemmaEdition, lineFrom, commentGroup, onAfterClicked, maxLine }) => (
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

		{selectedLemmaEdition.lines.map((line) => {
			
			const lineClass = getLineClass(commentGroup.lineFrom, commentGroup.lineTo, line.n);

			return (
				<div
					className={lineClass}
					key={line.n}
				>
					<div className="lemma-text" dangerouslySetInnerHTML={{ __html: line.html }} />

					<div className="lemma-meta">
						{(line.n % 5 === 0 || line.n === 1) ?
							<span className="lemma-line-n">
								{line.n}
							</span>
						: '' }
					</div>
				</div>
			);
		})}

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
ContextPanelText.propTypes = {
	lineFrom: React.PropTypes.number.isRequired,
	onBeforeClicked: React.PropTypes.func.isRequired,
	onAfterClicked: React.PropTypes.func.isRequired,
	selectedLemmaEdition: React.PropTypes.shape({
		lines: React.PropTypes.arrayOf(React.PropTypes.shape({
			n: React.PropTypes.number.isRequired,
			html: React.PropTypes.string.isRequired,
		}))
	}).isRequired,
	commentGroup: React.PropTypes.shape({
		lineFrom: React.PropTypes.number.isRequired,
		lineTo: React.PropTypes.number,
	}).isRequired,
	maxLine: React.PropTypes.number.isRequired,
};
ContextPanelText.defaultProps = {
	lineTo: null,
};

export default ContextPanelText;
