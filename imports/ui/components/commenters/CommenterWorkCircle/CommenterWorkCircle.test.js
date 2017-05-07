import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommenterWorkCircle from './CommenterWorkCircle';

describe('CommenterWorkCircle', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<CommenterWorkCircle
					workTitle="Iliad"
					workSlug="iliad"
					workLevel={0}
					nComments={0}
					toggleVisibleWork={() => {}}
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
