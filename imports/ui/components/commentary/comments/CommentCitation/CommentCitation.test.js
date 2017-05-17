import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentCitation from './CommentCitation';

describe('CommentCitation', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentCitation commentId="" revisions={[]} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix error:
// Warning: Failed context type: The context `muiTheme` is marked as required in `RaisedButton`, but its value is `undefined`.
// 	in RaisedButton (created by CommentCitation)
// in div (created by CommentCitation)
// in CommentCitation

