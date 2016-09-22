import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

SearchToolDropdown = React.createClass({

	propTypes: {
		name: React.PropTypes.string.isRequired, // name of the dropdown option
		children: React.PropTypes.node.isRequired, // content to show inside dropdown
		open: React.PropTypes.bool.isRequired, // whether dropdown is open or not
		toggle: React.PropTypes.func.isRequired, // function to toggle the dropdown
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	render() {
		return (
			<div
				className={`dropdown search-dropdown${this.props.open ? ' open' : ''}`}
			>
				<FlatButton
					className="search-tool dropdown-toggle"
					label={this.props.name}
					labelPosition="before"
					icon={<FontIcon className="mdi mdi-chevron-down" />}
					onClick={() => { this.props.toggle(this.props.name); }}
				/>

				<ul className="dropdown-menu">
					<div className="dropdown-menu-inner">
						{this.props.children}
					</div>

					<IconButton
						className="close-dropdown"
						iconClassName="mdi mdi-close"
						onClick={() => { this.props.toggle(this.props.name); }}
					/>
				</ul>


			</div>

		);
	},
});
