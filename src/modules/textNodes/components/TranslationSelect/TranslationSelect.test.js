import React from 'react';
import { shallow } from 'enzyme';

// component
import TranslationSelect from './TranslationSelect';

describe('TranslationSelect', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<TranslationSelect
			/>
		);
		expect(wrapper).toBeDefined();
	});
});
