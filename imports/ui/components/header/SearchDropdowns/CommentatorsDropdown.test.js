import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentatorsDropdown from './CommentatorsDropdown';

describe('CommentatorsDropdown', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentatorsDropdown
				toggleSearchDropdown={() => {}}
				toggleSearchTerm={() => {}}
				toggle={() => {}}
			/>)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO: Fix error:
// Warning: Failed context type: The context `muiTheme` is marked as required in `FlatButton`, but its value is `undefined`.
// 	in FlatButton (created by SearchToolDropdown)
// in div (created by SearchToolDropdown)
// in SearchToolDropdown (created by CommentatorsDropdown)
// in CommentatorsDropdown
