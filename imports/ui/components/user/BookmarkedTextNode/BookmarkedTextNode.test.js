import React from 'react';
import renderer from 'react-test-renderer';

// component:
import BookmarkedTextNode from './BookmarkedTextNode';

describe('BookmarkedTextNode', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<BookmarkedTextNode />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
