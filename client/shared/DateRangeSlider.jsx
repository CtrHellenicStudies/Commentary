import { debounce } from 'throttle-debounce';
import '../../node_modules/ion-rangeslider/js/ion.rangeSlider.js';
import '../../node_modules/ion-rangeslider/css/ion.rangeSlider.css';
import '../../node_modules/ion-rangeslider/css/ion.rangeSlider.skinNice.css';

DateRangeSlider = React.createClass({

	propTypes: {
		handleChangeDate: React.PropTypes.func.isRequired,
	},

	componentDidMount() {
		$('#date-range').ionRangeSlider({
			type: 'double',
			min: 1,
			max: 2100,
			grid: true,
			postfix: ' AD',
			values_separator: ' to ',
			onChange: debounce(500, this.props.handleChangeDate),

		});
	},

	render() {
		return (
			<div id="date-range" />
		);
	},

});
