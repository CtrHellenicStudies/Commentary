import React from 'react';
import renderer from 'react-test-renderer';

// component:
import DiscussionCommentTeaser from './DiscussionCommentTeaser';

describe('DiscussionCommentTeaser', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<DiscussionCommentTeaser
					discussionComment={{
						userId: 'testId',
						commentId: 'testId',
						comment: {
							work: {
								slug: 'iliad',
							},
							subwork: {
								title: '1'
							},
							lineFrom: 1,
						},
						status: 'publish',
						content: 'Quid faciat laetas segetes quo sidere terram vertere',
						otherCommentsCount: 0,
					}}
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
