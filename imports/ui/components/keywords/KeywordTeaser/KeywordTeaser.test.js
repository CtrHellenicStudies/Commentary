import React from 'react';
import renderer from 'react-test-renderer';

// component:
import KeywordTeaser from './KeywordTeaser';

describe('KeywordTeaser', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<KeywordTeaser />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
