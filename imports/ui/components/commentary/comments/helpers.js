import JsDiff from 'diff';
import { blue50, blue800, red50, red800, black, fullWhite } from 'material-ui/styles/colors';


const sortRevisions = (revisions) => {
	return _.sortBy(revisions, 'originalDate', 'created').reverse();
};

const getRevisionDate = (revision, comment) => {
	if (revision.originalDate) {
		return revision.originalDate;
	} else if (revision.updated) {
		return revision.updated;
	} else if (revision.created) {
		return revision.created;
	} else if (comment) {
		if (comment.updated) {
			return comment.updated;
		} else {
			return comment.created;
		}
	}

	console.error("No date information available for revision", revision._id);
	return null;
};

const stripHTMLFromText = (htmlText) => {
	const tempElem = document.createElement('div');
	tempElem.innerHTML = htmlText;
	return tempElem.textContent || tempElem.innerText || '';
};

const getRevisionDiff = (comment, revisionIndex) => {
	// build the diff view and return a DOM node
	const revisions = sortRevisions(comment.revisions);
	const baseRevision = revisions[revisionIndex];
	const newRevision = revisions[revisions.length - 1];

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


export { sortRevisions, getRevisionDate, getRevisionDiff };
