import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentKeywordsContainer from './CommentKeywordsContainer';

describe('CommentKeywordsContainer', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentKeywordsContainer keywords={[]} keywordOnClick={() => {}} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
