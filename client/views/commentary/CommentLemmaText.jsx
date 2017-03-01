import FlatButton from 'material-ui/FlatButton';

export default class CommentLemmaText extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			expanded: false,
		};
	}

	_toggleExpanded() {
		const { expanded } = this.state;

		this.setState({
			expanded: !expanded,
		});
	}

	render() {
		const { lines } = this.props;
		const { expanded } = this.state;

		const textLenghtBound = 10;
		const longText = lines.length >= textLenghtBound;

		// if long text
		if (longText) {
			const loops = expanded ? lines.length : textLenghtBound;
			const linesXML = [];

			// construct the XML to be rendered
			// number of lines depended on the expanded state
			for (let i = 0; i < loops; i += 1) {
				linesXML.push(
					<p
						key={i}
						className="lemma-text"
						dangerouslySetInnerHTML={{ __html: lines[i].html }}
					/>);
			}

			return (
				<div>
					{linesXML}
					<div>
						<FlatButton
							label={expanded ? 'Show less' : 'Show more'}
							icon={expanded ? <i className="mdi mdi-chevron-up" /> : <i className="mdi mdi-chevron-down" />}
							onClick={this._toggleExpanded.bind(this)}
						/>
					</div>
				</div>
			);
		}

		// if not lonText
		return (
			<div>
				{lines.map((line, i) => (
					<p
						key={i}
						className="lemma-text"
						dangerouslySetInnerHTML={{ __html: line.html }}
					/>
				))}
			</div>
		);
	}
}

CommentLemmaText.propTypes = {
	lines: React.PropTypes.arrayOf(React.PropTypes.shape({
		html: React.PropTypes.string.isRequired,
		n: React.PropTypes.number.isRequired,
	})).isRequired,
}

