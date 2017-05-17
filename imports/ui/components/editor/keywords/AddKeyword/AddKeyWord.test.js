import React from 'react';
import renderer from 'react-test-renderer';

// component:
import AddKeyword from './AddKeyword';

describe('AddKeyword', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<AddKeyword
					submitForm={() => {}}
					onTypeChange={() => {}}
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix TypeError: Cannot read property 'checked' of null (draft.js?)
