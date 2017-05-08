import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommenterTeaser from './CommenterTeaser';

describe('CommenterTeaser', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<CommenterTeaser
					commenter={{
						name: 'Test Commenter',
						slug: 'test-commenter',
					}}
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
