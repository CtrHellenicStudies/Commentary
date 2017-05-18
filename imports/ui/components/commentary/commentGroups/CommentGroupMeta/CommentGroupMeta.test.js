import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentGroupMeta from './CommentGroupMeta';

describe('CommentGroupMeta', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentGroupMeta
				commentGroup={{
					subwork: {
						title: 'testTitle'
					},
					lineFrom: 1,
					lineTo: 2,
					commenters: [
						{
							_id: 'testId',
							name: 'testName',
							slug: 'testName',
							avatar: {
								src: 'testSrc'
							}
						}
					]
				}}
			/>)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
