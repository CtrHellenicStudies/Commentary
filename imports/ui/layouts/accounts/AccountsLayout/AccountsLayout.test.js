import React from 'react';
import renderer from 'react-test-renderer';

// component:
import AccountsLayout from './AccountsLayout';

describe('AccountsLayout', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<AccountsLayout />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
