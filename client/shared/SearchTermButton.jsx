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
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	toggleSearchTerm() {
		this.props.toggleSearchTerm(this.props.searchTermKey, this.props.value);
	},

	render() {
		const styles = {
			iconStyle: {
				color: '#999',
			},
		};
		let className = 'search-term-button';

		if (this.props.active || this.props.activeWork) {
			className += ' search-term-button--active';
		}

		return (
			<li>
				<FlatButton
					className={className}
					onClick={this.toggleSearchTerm}
					label={this.props.label}
					icon={
						<FontIcon
							className="mdi mdi-plus-circle-outline"
							style={styles.iconStyle}
						/>
					}
				/>
			</li>
		);
	},
});

export default SearchTermButton;
