import React from 'react';
import renderer from 'react-test-renderer';

// component:
import AnnotationTextNode from './AnnotationTextNode';

describe('AnnotationTextNode', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<AnnotationTextNode />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
