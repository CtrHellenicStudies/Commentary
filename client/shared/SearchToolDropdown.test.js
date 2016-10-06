/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, import/no-extraneous-dependencies */

import { Meteor } from 'meteor/meteor';
import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import FlatButton from 'material-ui/FlatButton';
import SearchToolDropdown from './SearchToolDropdown.jsx';

if (Meteor.isClient) {
	describe('SearchToolDropdown', () => {
		it('should render', () => {
			const wrapper = shallow(
				<SearchToolDropdown
					name="TestDropdown"
				>
					<p>children</p>
				</SearchToolDropdown>
			);
			chai.assert.ok(wrapper.find(FlatButton), 'should contain the Flatbutton child');
			chai.assert.equal(wrapper.find(FlatButton).node.props.label, 'TestDropdown');
			chai.assert.ok(wrapper.find('p'), 'should render the children(<p> in this case)');
			chai.assert.equal(wrapper.find('p').text(), 'children');
		});

		it('should render with dropdown open', () => {
			const wrapper = shallow(
				<SearchToolDropdown
					name="TestDropdown"
					open={true}
				>
					<p>children</p>
				</SearchToolDropdown>
			);
			chai.assert(wrapper.hasClass('open'));
			chai.assert.ok(wrapper.find(FlatButton), 'should contain the Flatbutton child');
			chai.assert.equal(wrapper.find(FlatButton).node.props.label, 'TestDropdown');
			chai.assert.ok(wrapper.find('p'), 'should render the children(<p> in this case)');
			chai.assert.equal(wrapper.find('p').text(), 'children');
		});

		it('should render with dropdown disabled', () => {
			const wrapper = shallow(
				<SearchToolDropdown
					name="TestDropdown"
					disabled={true}
				>
					<p>children</p>
				</SearchToolDropdown>
			);
			chai.assert.ok(wrapper.find(FlatButton), 'should contain the Flatbutton child');
			chai.assert.equal(wrapper.find(FlatButton).node.props.label, 'TestDropdown');
			chai.assert.equal(wrapper.find(FlatButton).node.props.disabled, true);
			chai.assert.include(wrapper.find(FlatButton).node.props.className, 'search-tool-disabled');
			chai.assert.ok(wrapper.find('p'), 'should render the children(<p> in this case)');
			chai.assert.equal(wrapper.find('p').text(), 'children');
		});
	});
}

