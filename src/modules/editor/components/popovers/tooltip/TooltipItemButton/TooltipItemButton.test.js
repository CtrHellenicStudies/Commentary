import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import TooltipItemButton from './TooltipItemButton';
import configureStore from '../../../store';


describe('TooltipItemButton', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
				<TooltipItemButton
				/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
