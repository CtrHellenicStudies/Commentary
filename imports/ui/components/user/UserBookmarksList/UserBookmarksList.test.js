import React from 'react';
import renderer from 'react-test-renderer';

// component:
import UserBookmarksList from './UserBookmarksList';

describe('UserBookmarksList', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<UserBookmarksList />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
