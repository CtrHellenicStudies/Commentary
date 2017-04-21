import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';

// api:
import Tenants from '/imports/collections/tenants';

// components:
import AvatarIcon from '/imports/avatar/client/ui/AvatarIcon.jsx';
import SideNavTop from '/imports/ui/components/header/SideNavTop';  // eslint-disable-line import/no-absolute-path


/*
	helpers
*/
const getUsername = (currentUser) => {
	let username = '';
	if (Meteor.user()) {
		if (currentUser.profile && currentUser.profile.name) {
			username = currentUser.profile.name;
		} else {
			username = currentUser.username;
		}
	}
	return username;
};

LeftMenu = React.createClass({

	propTypes: {
		open: React.PropTypes.bool.isRequired,
		closeLeftMenu: React.PropTypes.func.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	getMeteorData() {
		return {
			currentUser: Meteor.users.findOne({ _id: Meteor.userId() }),
			tenant: Tenants.findOne({ _id: Session.get('tenantId') })
		};
	},

	scrollToAbout(e) {
		$('html, body').animate({ scrollTop: $('#about').height() - 100 }, 300);

		this.props.closeLeftMenu();
		e.preventDefault();
	},

	render() {
		const userIsLoggedIn = Meteor.user();
		const { tenant } = this.data;

		const username = getUsername(this.data.currentUser);

		return (
			<div>
				<Drawer
					open={this.props.open}
					docked={false}
					onRequestChange={this.props.closeLeftMenu}
					className="md-sidenav-left"
				>
					<SideNavTop
						currentUser={this.data.currentUser}
						username={username}
					/>
					{tenant && !tenant.isAnnotation && Roles.userIsInRole(Meteor.userId(), ['editor', 'admin', 'commenter']) ?
						<div>
							{tenant && !tenant.isAnnotation && Roles.userIsInRole(Meteor.userId(), ['admin']) ?
								<MenuItem
									href="http://ahcip-admin.chs.harvard.edu"
									target="_blank"
									primaryText="Admin"
									onClick={this.props.closeLeftMenu}
								/>
							: ''}
							<MenuItem
								href="/commentary/create"
								primaryText="Add Comment"
								onClick={this.props.closeLeftMenu}
							/>
							<MenuItem
								href="/keywords/create"
								primaryText="Add Keyword/Idea"
								onClick={this.props.closeLeftMenu}
							/>
							<Divider />
						</div>
						:
						'' }
					<MenuItem
						href="/"
						primaryText="Home"
						onClick={this.props.closeLeftMenu}
					/>
					{tenant && !tenant.isAnnotation &&
						<span>
							<MenuItem
								href="/commentary"
								primaryText="Commentary"
								onClick={this.props.closeLeftMenu}
							/>
							<MenuItem
								href="/keywords"
								primaryText="Keywords"
								onClick={this.props.closeLeftMenu}
							/>
							<MenuItem
								href="/keyideas"
								primaryText="Key Ideas"
								onClick={this.props.closeLeftMenu}
							/>
							<MenuItem
								href="/commenters"
								primaryText="Commentators"
								onClick={this.props.closeLeftMenu}
							/>
							<MenuItem
								href="/referenceWorks"
								primaryText="Reference Works"
								onClick={this.props.closeLeftMenu}
							/>
							<MenuItem
								href="/about"
								primaryText="About"
								onClick={this.props.closeLeftMenu}
							/>
							<MenuItem
								href="/#visualizations"
								primaryText="Visualizations"
								onClick={this.props.closeLeftMenu}
							/>
						</span>
					}
					<Divider />

					{userIsLoggedIn ?
						<div>
							<MenuItem
								href="/profile"
								primaryText="Profile"
								onClick={this.props.closeLeftMenu}
							/>
							<MenuItem
								href="/sign-out"
								primaryText="Sign out"
								onClick={this.props.closeLeftMenu}
							/>
						</div>
						:
						<div>
							<MenuItem
								href="/sign-in"
								primaryText="Sign in"
								onClick={this.props.closeLeftMenu}
							/>
						</div>
					}
				</Drawer>
			</div>
		);
	},
});
