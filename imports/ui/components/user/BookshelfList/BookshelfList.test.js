import React from 'react';
import renderer from 'react-test-renderer';

// component:
import BookshelfList from './BookshelfList';

describe('BookshelfList', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<BookshelfList />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
