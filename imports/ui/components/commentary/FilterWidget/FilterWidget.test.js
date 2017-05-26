import React from 'react';
import renderer from 'react-test-renderer';

// component:
import FilterWidget from './FilterWidget';

describe('FilterWidget', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<FilterWidget filters={[]} toggleSearchTerm={() => {}} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
