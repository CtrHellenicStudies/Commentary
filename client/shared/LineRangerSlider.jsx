
import '../../node_modules/ion-rangeslider/js/ion.rangeSlider.js';
import '../../node_modules/ion-rangeslider/css/ion.rangeSlider.css';
import '../../node_modules/ion-rangeslider/css/ion.rangeSlider.skinFlat.css';


LineRangeSlider = React.createClass({

	propTypes: {
		handleLineSearchChange: React.PropTypes.func.isRequired
	},

	componentDidMount(){
		$("#line-range").ionRangeSlider({
			min: 1,
			max: 2000,
			grid: true,
			force_edges: true,
			prettify_enabled: true,
			prettify_separator: ",",
			prefix: "Line: ",
			values_separator: " to ",

		});

	},

	render(){
		return (
				<div id="line-range"></div>
		);
	}

});
