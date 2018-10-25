import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import Tooltip from './Tooltip';
import configureStore from '../../../store';


describe('Tooltip', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
				<Tooltip
				/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
