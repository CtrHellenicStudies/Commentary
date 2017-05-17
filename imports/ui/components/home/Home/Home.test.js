import React from 'react';
import renderer from 'react-test-renderer';

// component:
import Home from './Home';

describe('Home', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<Home />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix CommenterTeaser: React.createClass is deprecated and will be removed in version 16. Use plain JavaScript classes instead. If you're not yet ready to migrate, create-react-class is available on npm as a drop-in replacement.

