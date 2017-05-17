import React from 'react';
import renderer from 'react-test-renderer';

// component:
import ReferenceDropdown from './ReferenceDropdown';

describe('ReferenceDropdown', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<ReferenceDropdown />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix TypeError: Cannot read property 'button' of undefined

