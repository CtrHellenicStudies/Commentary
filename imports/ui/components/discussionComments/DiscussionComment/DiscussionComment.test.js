import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component:
import DiscussionComment from './DiscussionComment';

describe('DiscussionComment', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<DiscussionComment
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
				</MuiThemeProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
