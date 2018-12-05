import React from 'react';
import { shallow } from 'enzyme';

import configureStore from '../../store/configureStore';

// component
import Root from './Root';

describe('Root', () => {
	it('renders correctly', () => {

		// configure store
		const store = configureStore();

		const wrapper = shallow(
			<Root
				store={store}
			/>
		);
		expect(wrapper).toBeDefined();
	});
});
