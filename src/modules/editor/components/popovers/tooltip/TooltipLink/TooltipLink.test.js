import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import TooltipLink from './TooltipLink';
import configureStore from '../../../store';


describe('TooltipLink', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
				<TooltipLink
				/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
