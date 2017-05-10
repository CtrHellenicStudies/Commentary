import React from 'react';
import renderer from 'react-test-renderer';

// component:
import KeywordTeaser from './KeywordTeaser';

describe('KeywordTeaser', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<KeywordTeaser
					keyword={{
						title: 'Test',
						slug: 'test',
						description: 'Test description',
					}}
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
