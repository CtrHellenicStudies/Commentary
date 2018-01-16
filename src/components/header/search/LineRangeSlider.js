import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'throttle-debounce';
import $ from 'jquery';

const id = 'line-range';

class LineRangeSlider extends Component {

	componentDidMount() {

		const { handleChangeLineN, lineFrom, lineTo } = this.props;
		$(`#${id}`).ionRangeSlider({
			type: 'double',
			min: 1,
			max: 909,
			grid: true,
			prettify_enabled: true,
			prettify_separator: ',',
			prefix: 'Line: ',
			values_separator: ' to ',
			onChange: debounce(500, handleChangeLineN),
			from: lineFrom,
			to: lineTo,
		});
	}

	render() {
		return <input id={id} />;
	}

}
LineRangeSlider.propTypes = {
	handleChangeLineN: PropTypes.func.isRequired,
	lineFrom: PropTypes.number,
	lineTo: PropTypes.number,
};
LineRangeSlider.defaultProps = {
	lineFrom: null,
	lineTo: null,
};

export default LineRangeSlider;
