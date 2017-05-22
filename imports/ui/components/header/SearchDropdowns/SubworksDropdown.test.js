import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component:
import SubworksDropdown from './SubworksDropdown';

describe('SubworksDropdown', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<SubworksDropdown
						selectedWork=""
						workInFilter={false}
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

