import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentLemmaText from './CommentLemmaText';

describe('CommentLemmaText', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentLemmaText lines={[]} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
