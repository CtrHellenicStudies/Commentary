import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommenterReferenceWorks from './CommenterReferenceWorks';

describe('CommenterReferenceWorks', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<CommenterReferenceWorks
					commenter={{
						name: 'Test Commenter',
						slug: 'test-commenter'
					}}
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
