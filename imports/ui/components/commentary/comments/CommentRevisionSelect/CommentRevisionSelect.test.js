import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component:
import CommentRevisionSelect from './CommentRevisionSelect';

describe('CommentRevisionSelect', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<CommentRevisionSelect
						commentId="testId"
						revisions={[
							{_id: 'testId'},
						]}
						selectedRevisionIndex={0}
						selectRevision={() => {}}
					/>
				</MuiThemeProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
