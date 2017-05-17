import React from 'react';
import renderer from 'react-test-renderer';

// component:
import KeywordReferenceModal from './KeywordReferenceModal';

describe('KeywordReferenceModal', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<KeywordReferenceModal />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix ReferenceError: ReactMeteorData is not defined

