import React from 'react';
import renderer from 'react-test-renderer';

// component:
import DiscussionThread from './DiscussionThread';

describe('DiscussionThread', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<DiscussionThread
					comment={{
						_id: 'testId',
					}}
					showDiscussionThread={() => {}}
					hideDiscussionThread={() => {}}
					toggleLemma={() => {}}
					discussionVisible
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
