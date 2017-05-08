/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, import/no-extraneous-dependencies */

import React from 'react';
import { shallow } from 'enzyme';
import chai from 'chai';
import sinon from 'sinon';

// component:
import SearchTermButton from './SearchTermButton'; 

describe('SearchTermButton', () => {
	it('should render', () => {
		const toggleSearchTerm = sinon.spy();
		const wrapper = shallow(
			<SearchTermButton
				toggleSearchTerm={toggleSearchTerm}
				label="TestSearchterm"
				searchTermKey="TestKey"
				value={{ key: 'value' }}
			/>
		);
		const button = wrapper.find('button');
		chai.assert.ok(button, 'should contain the button child');
	});

	it('should render with active prop set', () => {
		const toggleSearchTerm = sinon.spy();
		const wrapper = shallow(
			<SearchTermButton
				toggleSearchTerm={toggleSearchTerm}
				label="TestSearchterm"
				searchTermKey="TestKey"
				value={{ key: 'value' }}
				active
			/>
		);
		const button = wrapper.find('button');
		const props = wrapper.instance().props;
		chai.assert.ok(button, 'should contain the button child');
		chai.assert.equal(props.label, 'TestSearchterm');
		chai.assert.include(button.node.props.className, 'search-term-button--active');
	});

	it('should render with activeWork prop set', () => {
		const toggleSearchTerm = sinon.spy();
		const wrapper = shallow(
			<SearchTermButton
				toggleSearchTerm={toggleSearchTerm}
				label="TestSearchterm"
				searchTermKey="TestKey"
				value={{ key: 'value' }}
				activeWork
			/>
		);
		const button = wrapper.find('button');
		const props = wrapper.instance().props;
		chai.assert.ok(button, 'should contain the button child');
		chai.assert.equal(props.label, 'TestSearchterm');
		chai.assert.include(button.node.props.className, 'search-term-button--active');
	});

	it('should call parent callback with correct values', () => {
		const toggleSearchTerm = sinon.spy();
		const wrapper = shallow(
			<SearchTermButton
				toggleSearchTerm={toggleSearchTerm}
				label="TestSearchterm"
				searchTermKey="TestKey"
				value={{ key: 'value' }}
			/>
		);
		const button = wrapper.find('button');
		const props = wrapper.instance().props;
		button.simulate('click');
		sinon.assert.calledWith(toggleSearchTerm, 'TestKey', { key: 'value' });
		chai.assert.ok(button, 'should contain the button child');
		chai.assert.equal(props.label, 'TestSearchterm');
	});
});
