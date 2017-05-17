import React from 'react';
import renderer from 'react-test-renderer';

// component:
import AddComment from './AddComment';

describe('AddComment', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<AddComment submitForm={() => {}} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix Invariant Violation: Missing leafNode
