import React from 'react';
import renderer from 'react-test-renderer';

// component:
import Footer from './Footer';

describe('Footer', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<Footer />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
