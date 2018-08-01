import React from 'react';
import { shallow } from 'enzyme';

// component
import UpdateV2FormContainer from './UpdateV2FormContainer';

describe('UpdateV2FormContainer', () => {
	it('renders correctly', () => {

		const wrapper = shallow(<UpdateV2FormContainer />);
		expect(wrapper).toBeDefined();
	});
});
