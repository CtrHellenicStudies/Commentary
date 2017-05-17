import React from 'react';
import renderer from 'react-test-renderer';

// component:
import KeyideasDropdown from './KeyideasDropdown';

describe('KeyideasDropdown', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<KeyideasDropdown
				toggleSearchDropdown={() => {}}
				toggleSearchTerm={() => {}}
				toggle={() => {}}
			/>)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix error:
// Warning: Failed context type: The context `muiTheme` is marked as required in `FlatButton`, but its value is `undefined`.
// 	in FlatButton (created by SearchToolDropdown)
// in div (created by SearchToolDropdown)
// in SearchToolDropdown (created by KeyideasDropdown)
// in KeyideasDropdown

