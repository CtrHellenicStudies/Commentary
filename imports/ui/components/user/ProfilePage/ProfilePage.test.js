import React from 'react';
import renderer from 'react-test-renderer';

// component:
import ProfilePage from './ProfilePage';

describe('ProfilePage', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<ProfilePage />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
