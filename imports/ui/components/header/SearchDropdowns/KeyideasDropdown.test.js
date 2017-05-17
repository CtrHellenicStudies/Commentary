import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component:
import KeyideasDropdown from './KeyideasDropdown';

describe('KeyideasDropdown', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<KeyideasDropdown
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

