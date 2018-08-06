import React from 'react';
import PropTypes from 'prop-types';
import Slider, { Handle } from 'rc-slider';
import Tooltip from 'rc-tooltip';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import './LineRangeSlider.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);


const handle = (props) => {
	const { value, dragging, index, ...restProps } = props;
	return (
		<Tooltip
			visible
			defaultVisible
			placement="top"
			key={index}
		>
			{value}
			<Handle value={value} {...restProps} />
		</Tooltip>
	);
};

const LineRangeSlider = ({ handleChangeTextLocation, label, lineFrom, lineTo }) => {
	const marks = {};
	marks[lineFrom] = lineFrom.toString();
	marks[lineTo] = lineTo.toString();

	return (
		<div className="lineRangeSlider">
			<label>{label}</label>
			<div className="lineRangeSliderRange">
				<Range
					min={lineFrom}
					max={lineTo}
					handle={handle}
					onAfterChange={handleChangeTextLocation}
					defaultValue={[lineFrom, lineTo]}
					marks={marks}
					pushable
					trackStyle={[{
						background: '#795548',
					}, {
						background: '#795548',
					}]}
					dotStyle={{
						border: '2px solid #795548',
					}}
					handleStyle={[{
						border: '2px solid #795548',
						outline: 'none',
					}, {
						outline: 'none',
					}]}
				/>
			</div>
		</div>
	);
};

LineRangeSlider.propTypes = {
	handleChangeTextLocation: PropTypes.func.isRequired,
	lineFrom: PropTypes.number,
	lineTo: PropTypes.number,
};

LineRangeSlider.defaultProps = {
	lineFrom: 0,
	lineTo: 0,
};

export default LineRangeSlider;
