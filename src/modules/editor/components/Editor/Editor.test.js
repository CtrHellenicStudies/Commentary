import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import Editor from './Editor';
import configureStore from '../../store';


describe('Editor', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
			<Editor
			/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
