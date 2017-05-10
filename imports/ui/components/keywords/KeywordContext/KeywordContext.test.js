import React from 'react';
import renderer from 'react-test-renderer';

// component:
import KeywordContext from './KeywordContext';

describe('KeywordContext', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<KeywordContext />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
