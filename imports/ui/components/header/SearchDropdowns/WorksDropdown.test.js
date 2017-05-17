import React from 'react';
import renderer from 'react-test-renderer';

// component:
import WorksDropdown from './WorksDropdown';

describe('WorksDropdown', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<WorksDropdown />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix error:
// Warning: Failed context type: The context `muiTheme` is marked as required in `FlatButton`, but its value is `undefined`.
// 	in FlatButton (created by SearchToolDropdown)
// in div (created by SearchToolDropdown)
// in SearchToolDropdown (created by SubworksDropdown)
// in SubworksDropdown

