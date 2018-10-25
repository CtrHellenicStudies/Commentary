import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import { Link } from './Link';
import configureStore from '../../../store';


describe('Link', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
				<Link
				/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
