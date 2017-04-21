import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';

// api:
import Tenants from '/imports/collections/tenants';

// components:
import AvatarIcon from '/imports/avatar/client/ui/AvatarIcon.jsx';


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
		let username = '';
		const userIsLoggedIn = Meteor.user();
		const { tenant } = this.data;

		if (userIsLoggedIn) {
			if (this.data.currentUser.profile && this.data.currentUser.profile.name) {
				username = this.data.currentUser.profile.name;
			} else {
				username = this.data.currentUser.username;
			}
		}

		return (
			<div>
				<Drawer
					open={this.props.open}
					docked={false}
					onRequestChange={this.props.closeLeftMenu}
					className="md-sidenav-left"
				>
					<div className="sidenav-top">
						{userIsLoggedIn ?
							<a href="/profile">
								<div className="user-image paper-shadow">
									<AvatarIcon avatar={this.data.currentUser && this.data.currentUser.profile ? this.data.currentUser.profile.avatarUrl : '/images/default_user.jpg'} />
								</div>
							</a>
							: ''
						}
						<a href="/profile">
							<span className="user-fullname">
								{username}
							</span>
						</a>
					</div>
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
