
import '../../node_modules/ion-rangeslider/js/ion.rangeSlider.js';
import '../../node_modules/ion-rangeslider/css/ion.rangeSlider.css';
import '../../node_modules/ion-rangeslider/css/ion.rangeSlider.skinFlat.css';
import {debounce} from 'throttle-debounce';


LineRangeSlider = React.createClass({

	propTypes: {
		handleChangeLineN: React.PropTypes.func.isRequired
	},

	componentDidMount(){
		$("#line-range").ionRangeSlider({
			type: "double",
			min: 1,
			max: 2100,
			grid: true,
			prettify_enabled: true,
			prettify_separator: ",",
			prefix: "Line: ",
			values_separator: " to ",
			onChange:debounce(500, this.props.handleChangeLineN)

		});

	},

	render(){
		return (
				<div id="line-range"></div>
		);
	}

});