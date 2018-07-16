import React from 'react';
import PropTypes from 'prop-types';

// lib
import createRevisionMarkup from '../../../../../lib/createRevisionMarkup';


class CommentBodyText extends React.Component {

	constructor(props) {
		super(props);

		this.highlightText = this.highlightText.bind(this);
	}


	highlightText(text) {
		const { searchTerm } = this.props;
		const termToHighlightRegEx = new RegExp(searchTerm, 'ig');
		const termToHighlight = text.match(termToHighlightRegEx)[0];

		const highlightTag = `<mark class="highlighted">${termToHighlight}</mark>`;

		return text.replace(termToHighlight, highlightTag);
	}

	renderHTML(text) {
		const { searchTerm } = this.props;
		let html = text;

		if (searchTerm) {
			html = this.highlightText(html);
		}


		if (this.props.createRevisionMarkup) {
			return createRevisionMarkup(html);
		}

		return { __html: html };
	}


	render() {
		const { text, onTextClick } = this.props;

		return (
			<div
				className="comment-body"
				dangerouslySetInnerHTML={this.renderHTML(text)}
				onClick={onTextClick}
			/>
		);
	}
}
CommentBodyText.propTypes = {
	text: PropTypes.string.isRequired,
	onTextClick: PropTypes.func,
	createRevisionMarkup: PropTypes.bool,
	searchTerm: PropTypes.string
};
CommentBodyText.defaultProps = {
	onTextClick: null,
	createRevisionMarkup: false,
};

export default CommentBodyText;
