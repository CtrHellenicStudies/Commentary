import React from 'react';
import renderer from 'react-test-renderer';

// component:
import AvatarIcon from './AvatarIcon';

describe('OAuthButtons', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<AvatarIcon />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
