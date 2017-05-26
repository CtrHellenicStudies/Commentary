import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component:
import WorksDropdown from './WorksDropdown';

describe('WorksDropdown', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<WorksDropdown
						toggleSearchDropdown={() => {}}
						toggleSearchTerm={() => {}}
						toggleSearchDropdown={() => {}}
					/>
				</MuiThemeProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
