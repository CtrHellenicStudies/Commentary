import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import AddTooltip from './AddTooltip';
import configureStore from '../../../store';


describe('AddTooltip', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
				<AddTooltip
				/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
