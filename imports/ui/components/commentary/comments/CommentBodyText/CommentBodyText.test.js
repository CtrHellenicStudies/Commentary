import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentBodyText from './CommentBodyText';

describe('CommentBodyText', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentBodyText text="" />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
