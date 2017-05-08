import React from 'react';
import renderer from 'react-test-renderer';

// component:
import PublicProfilePage from './PublicProfilePage';

describe('PublicProfilePage', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<PublicProfilePage />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
