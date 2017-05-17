import React from 'react';
import renderer from 'react-test-renderer';

// component:
import KeywordsDropdown from './KeyideasDropdown';

describe('KeywordsDropdown', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<KeywordsDropdown
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

