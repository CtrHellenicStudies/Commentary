import React from 'react';
import renderer from 'react-test-renderer';

// component:
import AddCommentForm from './AddCommentForm';

describe('AddCommentForm', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<AddCommentForm selectedLineFrom="" selectedLineTo="" submitForm="" />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix ReferenceError: ReactMeteorData is not defined
