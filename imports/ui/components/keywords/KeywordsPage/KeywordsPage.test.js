import React from 'react';
import renderer from 'react-test-renderer';

// component:
import KeywordsPage from './KeywordsPage';

describe('KeywordsPage', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<KeywordsPage />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
