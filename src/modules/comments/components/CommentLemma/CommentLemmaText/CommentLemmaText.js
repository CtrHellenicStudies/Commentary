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
		const { textNodes } = this.props;
		const { expanded } = this.state;

		const textLengthBound = 10;
		const longText = textNodes.length > textLengthBound;

		// if long text
		if (longText) {
			const loops = expanded ? textNodes.length : textLengthBound;
			const textNodesHTML = [];
			let lastLocationIndex = null;

			// construct the HTML to be rendered
			// number of textNodes depended on the expanded state
			for (let i = 0; i < loops; i += 1) {
				lastLocationIndex = textNodes[i].location[textNodes[i].location.length - 1];

				textNodesHTML.push(
					<div
						key={`${textNodes[i].location.join('.')}.${textNodes[i].id}`}
						className="lemma-text-line"
					>
						<span
							className={`
								line-n ${(lastLocationIndex % 5) === 0  && lastLocationIndex.n !== 0 ?
		'line-n--visible'
		:
		''}
							`}
						>
							{textNodes[i].location.join('.')}
						</span>
						<p
							className="lemma-text"
							dangerouslySetInnerHTML={{ __html: textNodes[i].text }}
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
				{textNodes.map((textNode, i) => {
					const lastLocationIndex = textNode.location[textNode.location.length - 1];

					return (
						<div
							key={`${textNodes[i].location.join('.')}.${textNodes[i].id}`}
							className="lemma-text-line"
							style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'baseline'}}
						>
							<span className={`line-n ${(lastLocationIndex % 5) === 0 ? 'line-n--visible' : ''}`}>
								{textNode.location.join('.')}
							</span>
							<p
								className="lemma-text"
								dangerouslySetInnerHTML={{ __html: textNode.text }}
							/>
						</div>
					);
				})}
			</div>
		);
	}
}

CommentLemmaText.propTypes = {
	textNodes: PropTypes.arrayOf(PropTypes.shape({
		text: PropTypes.string.isRequired,
		location: PropTypes.arrayOf(PropTypes.number.isRequired),
	})).isRequired,
};

export default CommentLemmaText;
