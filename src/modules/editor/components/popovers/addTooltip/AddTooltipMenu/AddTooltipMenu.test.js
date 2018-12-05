import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import AddTooltipMenu from './AddTooltipMenu';
import configureStore from '../../../store';


describe('AddTooltipMenu', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
				<AddTooltipMenu
				/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
