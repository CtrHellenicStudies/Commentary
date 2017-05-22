import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommentLemmaSelect from './CommentLemmaSelect';

describe('CommentLemmaSelect', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<CommentLemmaSelect
					workSlug={'iliad'}
					subworkN={1}
					selectedLineFrom={1}
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
