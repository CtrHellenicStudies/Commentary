import React from 'react';
import renderer from 'react-test-renderer';

// component:
import AddKeywordLayout from './AddKeywordLayout';

describe('AddKeywordLayout', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<AddKeywordLayout />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
