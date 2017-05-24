import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component:
import LinkButtonDialog from './LinkButtonDialog';

describe('LinkButtonDialog', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<LinkButtonDialog
						open={false}
						handleClose={() => {}}
						handleAddLink={() => {}}
						handleRemoveLink={() => {}}
						onValueChange={() => {}}
					/>
				</MuiThemeProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
