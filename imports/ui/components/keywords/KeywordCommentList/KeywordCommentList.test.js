import React from 'react';
import renderer from 'react-test-renderer';

// component:
import KeywordCommentList from './KeywordCommentList';

describe('KeywordCommentList', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<KeywordCommentList />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
