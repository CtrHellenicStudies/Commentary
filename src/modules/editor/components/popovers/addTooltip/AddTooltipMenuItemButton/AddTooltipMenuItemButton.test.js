import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import AddTooltipMenuItemButton from './AddTooltipMenuItemButton';
import configureStore from '../../../store';


describe('AddTooltipMenuItemButton', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
				<AddTooltipMenuItemButton
				/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
