import React from 'react';
import renderer from 'react-test-renderer';

// component:
import EditKeywordLayout from './EditKeywordLayout';

describe('EditKeywordLayout', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<EditKeywordLayout />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
