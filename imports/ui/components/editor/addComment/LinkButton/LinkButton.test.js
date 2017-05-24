import React from 'react';
import renderer from 'react-test-renderer';

// component:
import LinkButton from './LinkButton';

describe('LinkButton', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<LinkButton />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
