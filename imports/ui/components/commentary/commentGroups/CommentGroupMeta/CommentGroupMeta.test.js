import React from 'react';
import renderer from 'react-test-renderer';


// component:
import CommentGroupMeta from './CommentGroupMeta';

describe('CommentGroupMeta', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentGroupMeta />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
