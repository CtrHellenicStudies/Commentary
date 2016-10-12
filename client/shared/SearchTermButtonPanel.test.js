/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, import/no-extraneous-dependencies */

import { Meteor } from 'meteor/meteor';
import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';

import { brown500, brown800, grey300, white, black } from 'material-ui/styles/colors';
import Chip from 'material-ui/Chip';
import SearchTermButtonPanel from './SearchTermButtonPanel.jsx';

if (Meteor.isClient) {
	describe('SearchTermButtonPanel', () => {
		it('should render', () => {
			const toggleSearchTerm = sinon.spy();
			const wrapper = shallow(
				<SearchTermButtonPanel
					toggleSearchTerm={toggleSearchTerm}
					label="TestSearchterm"
					searchTermKey="TestKey"
					value={{ key: 'value' }}
				/>
			);
			const chip = wrapper.find(Chip);
			chai.assert.ok(chip, 'should contain the Chip child');
			chai.assert.equal(chip.childAt(1).text(), 'TestSearchterm');
		});

		it('should render with active prop set', () => {
			const toggleSearchTerm = sinon.spy();
			const wrapper = shallow(
				<SearchTermButtonPanel
					toggleSearchTerm={toggleSearchTerm}
					label="TestSearchterm"
					searchTermKey="TestKey"
					value={{ key: 'value' }}
					active
				/>
			);
			const chip = wrapper.find(Chip);
			chai.assert.ok(chip, 'should contain the Chip child');
			chai.assert.equal(chip.childAt(1).text(), 'TestSearchterm');
			chai.assert.include(chip.childAt(0).node.props.backgroundColor, brown800);
		});

		it('should render with activeWork prop set', () => {
			const toggleSearchTerm = sinon.spy();
			const wrapper = shallow(
				<SearchTermButtonPanel
					toggleSearchTerm={toggleSearchTerm}
					label="TestSearchterm"
					searchTermKey="TestKey"
					value={{ key: 'value' }}
					activeWork
				/>
			);
			const chip = wrapper.find(Chip);
			chai.assert.ok(chip, 'should contain the Chip child');
			chai.assert.equal(chip.childAt(1).text(), 'TestSearchterm');
			chai.assert.include(chip.childAt(0).node.props.backgroundColor, brown800);
		});
		it('should call parent callback with correct values', () => {
			const toggleSearchTerm = sinon.spy();
			const wrapper = shallow(
				<SearchTermButtonPanel
					toggleSearchTerm={toggleSearchTerm}
					label="TestSearchterm"
					searchTermKey="TestKey"
					value={{ key: 'value' }}
				/>
			);
			const chip = wrapper.find(Chip);
			chip.simulate('touchTap');
			sinon.assert.calledWith(toggleSearchTerm, 'TestKey', { key: 'value' });
			chai.assert.ok(chip, 'should contain the Chip child');
			chai.assert.equal(chip.childAt(1).text(), 'TestSearchterm');
		});
	});
}

