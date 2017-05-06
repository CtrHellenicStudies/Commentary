import React from 'react';
import renderer from 'react-test-renderer';

// component:
import AddCommentLayout from './AddCommentLayout';

describe('AddCommentLayout', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<AddCommentLayout />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
