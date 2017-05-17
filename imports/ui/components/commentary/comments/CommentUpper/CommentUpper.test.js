import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentUpper from './CommentUpper';

describe('CommentUpper', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentUpper title="" commentId="" commenters={[]} updateDate="" />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
