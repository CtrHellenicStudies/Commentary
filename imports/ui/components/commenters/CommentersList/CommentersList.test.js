import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentersList from './CommentersList';

describe('CommentersList', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentersList />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
