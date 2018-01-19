import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'throttle-debounce';

const id = 'line-range';

class LineRangeSlider extends React.Component {

	componentDidMount() {

		const subdomain = location.hostname.split('.')[0];
		const { handleChangeLineN, lineFrom, lineTo } = this.props;

		$(`#${id}`).ionRangeSlider({
			type: 'double',
			min: 1,
			max: subdomain === 'pausanias' ? 12 : 909,
			grid: true,
			prettify_enabled: true,
			prettify_separator: ',',
			prefix: subdomain === 'pausanias' ? 'Section: ' : 'Line: ',
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
