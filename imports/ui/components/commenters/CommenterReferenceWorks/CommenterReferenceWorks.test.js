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
						_id: 'testId',
						name: 'Test Commenter',
						slug: 'test-commenter'
					}}
					settings={{
						title: 'Test Settings',
					}}
					isTest
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
