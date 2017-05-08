import React from 'react';
import renderer from 'react-test-renderer';

// component:
import DiscussionCommentsList from './DiscussionCommentsList';

describe('DiscussionCommentsList', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<DiscussionCommentsList
					discussionComments={[{
						commentId: 'testID',
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
					}]}
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
