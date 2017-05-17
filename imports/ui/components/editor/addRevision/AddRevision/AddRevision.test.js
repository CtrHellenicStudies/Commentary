import React from 'react';
import renderer from 'react-test-renderer';

// component
import AddRevision from './AddRevision';

describe('AddRevision', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<AddRevision />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix TypeError: Cannot read property 'revisions' of undefined
