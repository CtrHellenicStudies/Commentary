/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, import/no-extraneous-dependencies */

import React from 'react';
import { shallow } from 'enzyme';
import chai from 'chai';
import sinon from 'sinon';
import { brown800 } from 'material-ui/styles/colors';

// components:
import SearchTermButtonPanel from './SearchTermButtonPanel'; // eslint-disable-line import/no-absolute-path

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
		const span = wrapper.find('span');
		chai.assert.ok(span, 'should contain the span child');
		chai.assert.equal(span.text(), 'TestSearchterm');
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
		const span = wrapper.find('span');
		chai.assert.ok(span, 'should contain the span child');
		chai.assert.equal(span.text(), 'TestSearchterm');
		const button = wrapper.find('button');
		chai.assert.equal(button.hasClass('search-term-button--active'), true);
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
		const span = wrapper.find('span');
		chai.assert.ok(span, 'should contain the span child');
		chai.assert.equal(span.text(), 'TestSearchterm');
		const button = wrapper.find('button');
		chai.assert.equal(button.hasClass('search-term-button--active'), true);
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
		const button = wrapper.find('button');
		button.simulate('click');
		sinon.assert.calledWith(toggleSearchTerm, 'TestKey', { key: 'value' });

		const span = wrapper.find('span');
		chai.assert.ok(span, 'should contain the span child');
		chai.assert.equal(span.text(), 'TestSearchterm');
	});
});
