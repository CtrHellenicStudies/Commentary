import React from 'react';
import renderer from 'react-test-renderer';

// component:
import LineRangeSlider from './LineRangeSlider';

describe('LineRangeSlider', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<LineRangeSlider handleChangeLineN={() => {}} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
