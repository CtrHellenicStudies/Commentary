import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentLemmaSelect from './CommentLemmaSelect';

describe('CommentLemmaSelect', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommentLemmaSelect />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
