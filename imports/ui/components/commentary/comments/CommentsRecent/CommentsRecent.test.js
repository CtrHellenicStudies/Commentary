import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentsRecent from './CommentsRecent';

describe('CommentsRecent', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentsRecent />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
