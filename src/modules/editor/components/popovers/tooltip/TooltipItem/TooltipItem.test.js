import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import TooltipItem from './TooltipItem';
import configureStore from '../../../store';


describe('TooltipItem', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
				<TooltipItem
				/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
