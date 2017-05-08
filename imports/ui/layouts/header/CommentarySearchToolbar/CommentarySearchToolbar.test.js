import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component:
import CommentarySearchToolbar from './CommentarySearchToolbar';

describe('CommentarySearchToolbar', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<CommentarySearchToolbar
						filters={[]}
						toggleSearchTerm={() => {}}
						handleChangeLineN={() => {}}
						handleChangeTextsearch={() => {}}
						addCommentPage
					/>
				</MuiThemeProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
