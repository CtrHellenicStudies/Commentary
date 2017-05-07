import React from 'react';
import renderer from 'react-test-renderer';

// component:
import KeywordsList from './KeywordsList';

describe('KeywordsList', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<KeywordsList />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
