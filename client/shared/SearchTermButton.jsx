import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

SearchTermButton = React.createClass({

	propTypes: {
		toggleSearchTerm: React.PropTypes.func.isRequired,
		label: React.PropTypes.string.isRequired,
		searchTermKey: React.PropTypes.string.isRequired,
		value: React.PropTypes.object.isRequired,
		activeWork: React.PropTypes.bool,
		active: React.PropTypes.bool,
		switchSubworks: React.PropTypes.func,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	toggleSearchTerm() {
		this.props.toggleSearchTerm(this.props.searchTermKey, this.props.value);
		/*
		if (this.props.switchSubworks) {
			this.props.switchSubworks();
		}
		*/
	},

	render() {
		let className = 'search-term-button';

		if (this.props.active || this.props.activeWork) {
			className += ' search-term-button--active';
		}

		return (
			<li>
				<button
					className={className}
					onClick={this.toggleSearchTerm}
				>
					<span className="search-term-button-label">
						{this.props.label}
					</span>
					<FontIcon
						className="mdi mdi-plus-circle-outline search-term-button-icon"
					/>
				</button>
			</li>
		);
	},
});

export default SearchTermButton;
