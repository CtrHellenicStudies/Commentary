import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

SearchTermButtonPanel = React.createClass({

	propTypes: {
		toggleSearchTerm: React.PropTypes.func.isRequired,
		label: React.PropTypes.string.isRequired,
		searchTermKey: React.PropTypes.string.isRequired,
		value: React.PropTypes.object.isRequired,
		activeWork: React.PropTypes.bool,
		active: React.PropTypes.bool,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			active: false,
		};
	},


	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	toggleSearchTerm() {
		this.props.toggleSearchTerm(this.props.searchTermKey, this.props.value);
		this.setState({
			active: !this.state.active,
		});
	},

	render() {
		let className = 'search-term-button';
		let active = this.props.active;

		if ('activeWork' in this.props && this.props.activeWork === true) {
			active = true;
		} else if (this.state.active) {
			active = true;
		}

		if (active) {
			className += ' search-term-button--active';
		}

		return (
			<button
				className={className}
				onTouchTap={this.toggleSearchTerm}
			>
				<span>{this.props.label}</span>
			</button>
		);
	},
});

export default SearchTermButtonPanel;
