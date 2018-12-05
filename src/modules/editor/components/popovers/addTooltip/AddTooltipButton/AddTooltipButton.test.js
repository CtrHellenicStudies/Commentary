import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import AddTooltipButton from './AddTooltipButton';
import configureStore from '../../../store';


describe('AddTooltipButton', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
				<AddTooltipButton
				/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
