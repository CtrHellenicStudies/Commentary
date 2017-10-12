import React from 'react';

// lib
import createRevisionMarkup from '/imports/lib/createRevisionMarkup';


class CommentBodyText extends React.Component {

	constructor(props) {
		super(props);

		this.highlightText = this.highlightText.bind(this);
	}

	static defaultProps = {
		onTextClick: null,
		createRevisionMarkup: false,
	}

	static propTypes = {
		text: React.PropTypes.string.isRequired,
		onTextClick: React.PropTypes.func,
		createRevisionMarkup: React.PropTypes.bool,
		searchTerm: React.PropTypes.string
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
		const { text, onTextClick, searchTerm } = this.props;

		return (
			<div
				className="comment-body"
				dangerouslySetInnerHTML={this.renderHTML(text)}
				onClick={onTextClick}
			/>
		);
	}
}

export default CommentBodyText;
