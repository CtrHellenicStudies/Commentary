/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, import/no-extraneous-dependencies */

import {Meteor} from 'meteor/meteor';
import React from 'react';
import {shallow} from 'enzyme';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

import FlatButton from 'material-ui/FlatButton';
import SearchTermButton from './SearchTermButton.jsx';

if (Meteor.isClient) {
	describe('SearchTermButton', () = > {
		it('should render',() =
>
	{
		const toggleSearchTerm = sinon.spy();
		const wrapper = shallow(
			< SearchTermButton
		toggleSearchTerm = {toggleSearchTerm}
		label = "TestSearchterm"
		searchTermKey = "TestKey"
		value = {
		{
			key: 'value'
		}
	}
	/>
	)
		;
		chai.assert.ok(wrapper.find(FlatButton), 'should contain the Flatbutton child');
		chai.assert.equal(wrapper.find(FlatButton).node.props.label, 'TestSearchterm');
	}
)
	;

	it('should render with active prop set', () = > {
		const toggleSearchTerm = sinon.spy();
	const wrapper = shallow(
		< SearchTermButton
	toggleSearchTerm = {toggleSearchTerm}
	label = "TestSearchterm"
	searchTermKey = "TestKey"
	value = {
	{
		key: 'value'
	}
}
	active
	/ >
)
	;
	const flatButton = wrapper.find(FlatButton);
	chai.assert.ok(flatButton, 'should contain the Flatbutton child');
	chai.assert.equal(flatButton.node.props.label, 'TestSearchterm');
	chai.assert.include(flatButton.node.props.className, 'search-term-button--active');
})
	;

	it('should render with activeWork prop set', () = > {
		const toggleSearchTerm = sinon.spy();
	const wrapper = shallow(
		< SearchTermButton
	toggleSearchTerm = {toggleSearchTerm}
	label = "TestSearchterm"
	searchTermKey = "TestKey"
	value = {
	{
		key: 'value'
	}
}
	activeWork
	/ >
)
	;
	const flatButton = wrapper.find(FlatButton);
	chai.assert.ok(flatButton, 'should contain the Flatbutton child');
	chai.assert.equal(flatButton.node.props.label, 'TestSearchterm');
	chai.assert.include(flatButton.node.props.className, 'search-term-button--active');
})
	;
	it('should call parent callback with correct values', () = > {
		const toggleSearchTerm = sinon.spy();
	const wrapper = shallow(
		< SearchTermButton
	toggleSearchTerm = {toggleSearchTerm}
	label = "TestSearchterm"
	searchTermKey = "TestKey"
	value = {
	{
		key: 'value'
	}
}
/>
)
	;
	const flatButton = wrapper.find(FlatButton);
	flatButton.simulate('click');
	sinon.assert.calledWith(toggleSearchTerm, 'TestKey', {key: 'value'});
	chai.assert.ok(flatButton, 'should contain the Flatbutton child');
	chai.assert.equal(flatButton.node.props.label, 'TestSearchterm');
})
	;
})
	;
}

