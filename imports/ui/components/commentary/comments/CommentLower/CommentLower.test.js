import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentLower from './CommentLower';

describe('CommentLower', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentLower
				comment={{
					revisions: [
						{text: 'testText'}
					]
				}}
				revisionIndex={0}
			/>)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
 // TODO Fix TypeError: Cannot read property 'length' of undefined
