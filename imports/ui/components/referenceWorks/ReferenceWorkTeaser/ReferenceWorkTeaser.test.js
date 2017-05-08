import React from 'react';
import renderer from 'react-test-renderer';

// component:
import ReferenceWorkTeaser from './ReferenceWorkTeaser';

describe('ReferenceWorkTeaser', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<ReferenceWorkTeaser
					referenceWork={{
						title: 'Test Work',
						slug: 'test-work',
						description: 'Quid faciat laetas segetes quo sidere terram vertere',
						link: 'http://ahcip.chs.harvard.edu/',
					}}
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
