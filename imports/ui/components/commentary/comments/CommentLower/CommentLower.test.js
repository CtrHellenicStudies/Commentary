import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentLower from './CommentLower';

describe('CommentLower', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentLower comment={{}} revisionIndex={1} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
 // TODO Fix TypeError: Cannot read property 'length' of undefined
