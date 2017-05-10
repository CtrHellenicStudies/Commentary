import React from 'react';
import renderer from 'react-test-renderer';

// component:
import ReferenceWorksList from './ReferenceWorksList';

describe('ReferenceWorksList', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<ReferenceWorksList
					referenceWorks={[]}
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
