import React from 'react';
import JsDiff from 'diff';
import { blue50, blue800, red50, red800, black, fullWhite } from 'material-ui/styles/colors';

import CommentBodyText from '/imports/ui/components/commentary/comments/CommentBodyText';  // eslint-disable-line import/no-absolute-path

/*
	helpers
*/

const stripHTMLFromText = (htmlText) => {
	const tempElem = document.createElement('div');
	tempElem.innerHTML = htmlText;
	return tempElem.textContent || tempElem.innerText || '';
};

const getRevisionDiff = (comment, revisionIndex) => {
	// build the diff view and return a DOM node
	const baseRevision = comment.revisions[revisionIndex];
	const newRevision = comment.revisions[comment.revisions.length - 1];

	const revisionDiff = document.createElement('comment-diff');

	const baseRevisionText = stripHTMLFromText(baseRevision.text);
	const newRevisionText = stripHTMLFromText(newRevision.text);

	const diff = JsDiff.diffWordsWithSpace(baseRevisionText, newRevisionText);

	diff.forEach((part) => {
		// green for additions, red for deletions
		let color = black;
		let background = fullWhite;
		const span = document.createElement('span');

		if (part.added) {
			color = blue800;
			background = blue50;
		} else if (part.removed) {
			color = red800;
			background = red50;
			span.style.textDecoration = 'line-through';
		}

		span.style.color = color;
		span.style.background = background;
		span.style.padding = '0px';

		span.appendChild(document
			.createTextNode(part.value));
		revisionDiff.appendChild(span);
	});

	return revisionDiff;
};


/*
	BEGIN CommentBody
*/
const CommentBody = (props) => {

	if (props.revisionIndex === props.comment.revisions.length - 1) {
		return (
			<CommentBodyText
				text={props.comment.revisions[props.revisionIndex].text}
				onTextClick={props.onTextClick}
				createRevisionMarkup
			/>
		);
	}

	return (
		<CommentBodyText
			text={getRevisionDiff(props.comment, props.revisionIndex).innerHTML}
		/>
	);
};
CommentBody.propTypes = {
	comment: React.PropTypes.shape({
		revisions: React.PropTypes.arrayOf(React.PropTypes.shape({
			text: React.PropTypes.string.isRequired,
		})),
	}).isRequired,
	revisionIndex: React.PropTypes.number.isRequired,
	onTextClick: React.PropTypes.func,
};
CommentBody.defaultProps = {
	onTextClick: null,
};
/*
	END CommentBody
*/


export default CommentBody;
