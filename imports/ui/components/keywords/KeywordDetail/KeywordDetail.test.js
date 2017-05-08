import React from 'react';
import renderer from 'react-test-renderer';

// component:
import KeywordDetail from './KeywordDetail';

describe('KeywordDetail', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<KeywordDetail />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
