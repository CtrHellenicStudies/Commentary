import React from 'react';
import renderer from 'react-test-renderer';

// component:
import LoadingHome from './LoadingHome';

describe('LoadingHome', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<LoadingHome />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
