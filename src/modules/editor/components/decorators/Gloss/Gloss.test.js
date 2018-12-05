import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import { Gloss } from './Gloss';
import configureStore from '../../../store';


describe('Gloss', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
				<Gloss
				/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
