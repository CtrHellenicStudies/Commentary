import React from 'react';
import { debounce } from 'throttle-debounce';

const id = 'line-range';

class LineRangeSlider extends React.Component {

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
	handleChangeLineN: React.PropTypes.func.isRequired,
	lineFrom: React.PropTypes.number,
	lineTo: React.PropTypes.number,
};
LineRangeSlider.defaultProps = {
	lineFrom: null,
	lineTo: null,
};

export default LineRangeSlider;
