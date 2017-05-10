import React from 'react';
import renderer from 'react-test-renderer';

// component:
import Page from './Page';

describe('Page', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<Page slug="__test__" />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
