import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentBody from './CommentBody';

describe('CommentBody', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentBody
				comment={{
					revisions: [
						{
							text: 'testText'
						}
					]
				}}
				revisionIndex={0}
			/>)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
