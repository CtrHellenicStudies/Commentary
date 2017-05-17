import React from 'react';
import renderer from 'react-test-renderer';

// component:
import WorkVisualization from './WorkVisualization';

describe('WorkVisualization', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<WorkVisualization work={{}} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix WorkVisualization: React.createClass is deprecated and will be removed in version 16. Use plain JavaScript classes instead. If you're not yet ready to migrate, create-react-class is available on npm as a drop-in replacement.

