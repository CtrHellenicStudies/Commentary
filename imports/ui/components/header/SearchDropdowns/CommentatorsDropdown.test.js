import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component:
import CommentatorsDropdown from './CommentatorsDropdown';

describe('CommentatorsDropdown', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<CommentatorsDropdown
						toggleSearchDropdown={() => {}}
						toggleSearchTerm={() => {}}
						toggle={() => {}}
					/>
				</MuiThemeProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
