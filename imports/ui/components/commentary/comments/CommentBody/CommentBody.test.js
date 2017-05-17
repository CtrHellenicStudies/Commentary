import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentBody from './CommentBody';

describe('CommentBody', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentBody comment={{}} revisionIndex={1} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix length undefined error
