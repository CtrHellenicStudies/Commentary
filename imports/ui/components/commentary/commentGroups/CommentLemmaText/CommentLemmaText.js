import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

class CommentLemmaText extends React.Component {

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
		const longText = lines.length > textLenghtBound;

		// if long text
		if (longText) {
			const loops = expanded ? lines.length : textLenghtBound;
			const linesHTML = [];

			// construct the HTML to be rendered
			// number of lines depended on the expanded state
			for (let i = 0; i < loops; i += 1) {
				linesHTML.push(
					<div
						key={i}
						className="lemma-text-line"
					>
						<span className={`line-n ${(lines[i].n % 5) === 0 ? 'line-n--visible' : ''}`}>
							{'section' in lines[i] ? `${lines[i].section.n}.` : null}{lines[i].n}
						</span>
						<p
							className="lemma-text"
							dangerouslySetInnerHTML={{ __html: lines[i].html }}
						/>
					</div>
				);
			}

			return (
				<div className="comment-lemma-text">
					{linesHTML}
					<div
						className="commentary-lemma-show-more-button"
					>
						<FlatButton
							label={expanded ? 'Show less' : 'Show more'}
							icon={expanded ? <i className="mdi mdi-chevron-up" /> : <i className="mdi mdi-chevron-down" />}
							onClick={this._toggleExpanded.bind(this)}
						/>
					</div>
				</div>
			);
		}

		// if not longText
		return (
			<div className="comment-lemma-text">
				{lines.map((line, i) => (
					<div
						key={i}
						className="lemma-text-line"
						style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'baseline'}}
					>
						<span className={`line-n ${(line.n % 5) === 0 ? 'line-n--visible' : ''}`}>
							{'section' in line ? `${line.section.n}.` : null}{line.n}
						</span>
						<p
							className="lemma-text"
							dangerouslySetInnerHTML={{ __html: line.html }}
						/>
					</div>
				))}
			</div>
		);
	}
}

CommentLemmaText.propTypes = {
	lines: PropTypes.arrayOf(PropTypes.shape({
		html: PropTypes.string.isRequired,
		n: PropTypes.number.isRequired,
		section: PropTypes.object,
	})).isRequired,
};

export default CommentLemmaText;
