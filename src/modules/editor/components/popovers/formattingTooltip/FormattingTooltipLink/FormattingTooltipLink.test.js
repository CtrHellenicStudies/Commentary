import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux'

import FormattingTooltipLink from './FormattingTooltipLink';
import configureStore from '../../../store';


describe('FormattingTooltipLink', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<Provider store={configureStore()} >
				<FormattingTooltipLink
				/>
			</Provider>
		);
		expect(wrapper).toBeDefined();
	});
});
