import React from 'react';
import renderer from 'react-test-renderer';

// component:
import Home from './Home';

describe('Home', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<Home />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix wowjs issue (is the script tag in the html?)
