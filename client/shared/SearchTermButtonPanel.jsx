import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { brown500, brown800, grey300, white, black } from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Chip from 'material-ui/Chip';

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
		let backgroundColor = grey300;
		let color = black;
		let className = 'search-term-button';
		let active = this.props.active;

		if ('activeWork' in this.props && this.props.activeWork === true) {
			active = true;
		} else if (this.state.active) {
			active = true;
		}

		if (active) {
			className += ' search-term-button--active';
			backgroundColor = brown500;
			color = white;
		}
		const styles = {
			chip: {
				margin: 5,
				maxWidth: '100%',
			},
			chipLabel: {
				color,
				textOverflow: 'ellipsis',
				overflow: 'hidden',
			},
		};


		return (
			<Chip
				className={className}
				backgroundColor={backgroundColor}
				onTouchTap={this.toggleSearchTerm}
				style={styles.chip}
				labelStyle={styles.chipLabel}
			>
				{active ?
					<Avatar
						icon={<FontIcon className="mdi mdi-minus" />}
						backgroundColor={brown800}
					/>
					:
					<Avatar
						icon={<FontIcon className="mdi mdi-plus" />}
					/>
				}

				{this.props.label}
			</Chip>
		);
	},
});
