import React from 'react';
import renderer from 'react-test-renderer';

// component:
import AddRevisionLayout from './AddRevisionLayout';

describe('AddRevisionLayout', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<AddRevisionLayout />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
