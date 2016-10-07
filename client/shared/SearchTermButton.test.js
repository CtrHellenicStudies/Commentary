/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, import/no-extraneous-dependencies */

import { Meteor } from 'meteor/meteor';
import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import FlatButton from 'material-ui/FlatButton';
import SearchTermButton from './SearchTermButton.jsx';

if (Meteor.isClient) {
	describe('SearchTermButton', () => {
		it('should render', () => {
			const wrapper = shallow(
				<SearchTermButton
					label="TestSearchterm"
				/>
			);
			chai.assert.ok(wrapper.find(FlatButton), 'should contain the Flatbutton child');
			chai.assert.equal(wrapper.find(FlatButton).node.props.label, 'TestSearchterm');
		});

		it('should render with active prop set', () => {
			const wrapper = shallow(
				<SearchTermButton
					label="TestSearchterm"
					active
				/>
			);
			const flatButton = wrapper.find(FlatButton);
			chai.assert.ok(flatButton, 'should contain the Flatbutton child');
			chai.assert.equal(flatButton.node.props.label, 'TestSearchterm');
			chai.assert.include(flatButton.node.props.className, 'search-term-button--active');
		});

		it('should render with activeWork prop set', () => {
			const wrapper = shallow(
				<SearchTermButton
					label="TestSearchterm"
					activeWork
				/>
			);
			const flatButton = wrapper.find(FlatButton);
			chai.assert.ok(flatButton, 'should contain the Flatbutton child');
			chai.assert.equal(flatButton.node.props.label, 'TestSearchterm');
			chai.assert.include(flatButton.node.props.className, 'search-term-button--active');
		});
	});
}

