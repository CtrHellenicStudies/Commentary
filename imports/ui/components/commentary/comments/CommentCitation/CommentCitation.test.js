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

// TODO Fix Invariant Violation: CommentCitation.getChildContext(): childContextTypes must be defined in order to use getChildContext().

