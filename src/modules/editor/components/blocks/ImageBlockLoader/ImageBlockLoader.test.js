import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import ImageBlockLoader from './ImageBlockLoader';
import configureStore from '../../../store';


describe('ImageBlockLoader', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
				<ImageBlockLoader
				/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
