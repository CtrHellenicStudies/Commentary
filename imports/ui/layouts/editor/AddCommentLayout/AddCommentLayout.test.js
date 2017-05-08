import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component:
import AddCommentLayout from './AddCommentLayout';

describe('AddCommentLayout', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<AddCommentLayout isTest />
				</MuiThemeProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
