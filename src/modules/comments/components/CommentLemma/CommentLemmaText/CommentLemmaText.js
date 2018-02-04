import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

class CommentLemmaText extends Component {

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
		const { textNodes } = this.props;
		const { expanded } = this.state;

		const textLenghtBound = 10;
		const longText = textNodes.length > textLenghtBound;

		// if long text
		if (longText) {
			const loops = expanded ? textNodes.length : textLenghtBound;
			const textNodesHTML = [];

			// construct the HTML to be rendered
			// number of textNodes depended on the expanded state
			for (let i = 0; i < loops; i += 1) {
				textNodesHTML.push(
					<div
						key={i}
						className="lemma-text-line"
					>
						<span
							className={`
								line-n ${(textNodes[i].n % 5) === 0  && textNodes[i].n !== 0 ?
									'line-n--visible'
								:
									''}
							`}
						>
							{textNodes[i].n}
						</span>
						<p
							className="lemma-text"
							dangerouslySetInnerHTML={{ __html: textNodes[i].html }}
						/>
					</div>
				);
			}

			return (
				<div className="comment-lemma-text">
					{textNodesHTML}
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
				{textNodes.map((line, i) => (
					<div
						key={i}
						className="lemma-text-line"
						style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'baseline'}}
					>
						<span className={`line-n ${(line.n % 5) === 0 ? 'line-n--visible' : ''}`}>
							{line.n}
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
	textNodes: PropTypes.arrayOf(PropTypes.shape({
		html: PropTypes.string.isRequired,
		n: PropTypes.number.isRequired,
	})).isRequired,
};

export default CommentLemmaText;
