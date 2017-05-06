import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentaryLayout from './CommentaryLayout';

describe('CommentaryLayout', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentaryLayout />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
