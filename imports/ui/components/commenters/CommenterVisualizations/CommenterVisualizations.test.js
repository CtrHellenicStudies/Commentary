import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommenterVisualizations from './CommenterVisualizations';

describe('CommenterVisualizations', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<CommenterVisualizations
					commenter={{
						nCommentsIliad: 0,
						nCommentsOdyssey: 0,
						nCommentsHymns: 0,
					}}
					isTest
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
