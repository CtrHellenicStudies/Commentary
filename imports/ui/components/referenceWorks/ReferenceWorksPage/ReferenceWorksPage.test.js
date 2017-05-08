import React from 'react';
import renderer from 'react-test-renderer';

// component:
import ReferenceWorksPage from './ReferenceWorksPage';

describe('ReferenceWorksPage', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<ReferenceWorksPage
					title="Test"
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
