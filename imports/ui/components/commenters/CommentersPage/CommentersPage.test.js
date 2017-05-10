import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentersPage from './CommentersPage';

describe('CommentersPage', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentersPage />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
