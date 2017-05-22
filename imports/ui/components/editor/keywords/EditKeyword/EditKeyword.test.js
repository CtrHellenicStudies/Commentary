import React from 'react';
import renderer from 'react-test-renderer';

// component:
import EditKeyword from './EditKeyword';

describe('EditKeyword', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<EditKeyword submitForm="" onTypeChange="" />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix ReferenceError: ReactMeteorData is not defined
