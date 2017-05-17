import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component:
import SearchCards from './SearchCards';

describe('SearchCards', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<SearchCards />
				</MuiThemeProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix Invariant Violation: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.
