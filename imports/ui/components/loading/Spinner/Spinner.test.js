import React from 'react';
import renderer from 'react-test-renderer';

// component:
import Spinner from './Spinner';

describe('Spinner', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<Spinner />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
