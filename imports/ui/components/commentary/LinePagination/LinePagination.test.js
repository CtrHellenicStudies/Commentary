import React from 'react';
import renderer from 'react-test-renderer';

// component:
import LinePagination from './LinePagination';

describe('LinePagination', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<LinePagination linePagination={[]} linePaginationClicked={() => {}} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
