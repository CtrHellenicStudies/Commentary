import React from 'react';
import renderer from 'react-test-renderer';


// component:
import WorksCard from './WorksCard';


describe('WorksCard', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<WorksCard cardHeader="test" />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

