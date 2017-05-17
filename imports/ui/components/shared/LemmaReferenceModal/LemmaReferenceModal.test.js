import React from 'react';
import renderer from 'react-test-renderer';

// component:
import LemmaReferenceModal from './LemmaReferenceModal';

describe('LemmaReferenceModal', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<LemmaReferenceModal
					top={1}
					left={1}
					work="testWork"
					subwork={1}
					lineFrom={1}
					closeLemmaReference={() => {}}
				/>)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix ReferenceError: ReactMeteorData is not defined

