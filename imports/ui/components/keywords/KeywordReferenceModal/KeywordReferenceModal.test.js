import React from 'react';
import renderer from 'react-test-renderer';

// component:
import KeywordReferenceModal from './KeywordReferenceModal';

describe('KeywordReferenceModal', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<KeywordReferenceModal
					keywordSlug="test"
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Refactor component to avoid mixins