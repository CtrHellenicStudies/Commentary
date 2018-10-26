import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import TooltipLemma from './TooltipLemma';
import configureStore from '../../../store';


describe('TooltipLemma', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
				<TooltipLemma
				/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
