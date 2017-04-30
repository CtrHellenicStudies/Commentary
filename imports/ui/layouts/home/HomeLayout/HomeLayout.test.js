// component:
import React from 'react';
import HomeLayout from './HomeLayout';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import renderer from 'react-test-renderer';

describe('HomeLayout', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<HomeLayout />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
