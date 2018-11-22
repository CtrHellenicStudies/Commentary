import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import TooltipGloss from './TooltipGloss';
import configureStore from '../../../store';


describe('TooltipGloss', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
				<TooltipGloss
				/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
