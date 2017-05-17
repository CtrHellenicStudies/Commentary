import React from 'react';
import renderer from 'react-test-renderer';

// component:
import SearchDropdowns from './SearchDropdowns';

describe('SearchDropdowns', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<SearchDropdowns />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix Error:
// Warning: Failed context type: The context `muiTheme` is marked as required in `FlatButton`, but its value is `undefined`.
// 	in FlatButton (created by SearchToolDropdown)
// in div (created by SearchToolDropdown)
// in SearchToolDropdown (created by KeyideasDropdown)
// in KeyideasDropdown

