import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentReference from './CommentReference';

describe('CommentReference', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentReference />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
