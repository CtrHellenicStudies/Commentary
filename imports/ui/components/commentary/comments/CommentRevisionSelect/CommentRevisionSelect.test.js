import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentRevisionSelect from './CommentRevisionSelect';

describe('CommentRevisionSelect', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentRevisionSelect
				commentId=""
				revisions={[]}
				selectedRevisionIndex={1}
				selectRevision={() => {}}
			/>)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

 // TODO Fix Error:
// Warning: Failed context type: The context `muiTheme` is marked as required in `RaisedButton`, but its value is `undefined`.
// 	in RaisedButton (created by CommentCitation)
// in div (created by CommentCitation)
// in CommentCitation (created by CommentRevisionSelect)
// in div (created by CommentRevisionSelect)
// in CommentRevisionSelect
