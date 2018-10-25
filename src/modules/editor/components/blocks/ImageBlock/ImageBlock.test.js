import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import ImageBlock from './ImageBlock';
import configureStore from '../../../store';


describe('ImageBlock', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
				<ImageBlock
				/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
