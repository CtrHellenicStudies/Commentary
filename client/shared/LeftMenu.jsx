import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

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

		if (userIsLoggedIn) {
			if (this.data.currentUser.profile && this.data.currentUser.profile.name) {
				username = this.data.currentUser.profile.name;
			} else if ('emails' in this.data.currentUser && this.data.currentUser.emails.length) {
				username = this.data.currentUser.emails[0].address;
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
											<div>
												<div className="user-image paper-shadow">
													<img src="/images/default_user.jpg"/>
												</div>
											</div>
											: ""
									}
									<span className="user-fullname">
										{username}
									</span>


								</div>
								<MenuItem
										href="/"
										primaryText="Home"
										onClick={this.props.closeLeftMenu}
								/>
								<MenuItem
										href="/commentary/"
										primaryText="Commentary"
										onClick={this.props.closeLeftMenu}
								/>
								<MenuItem
											href="/keywords/"
											primaryText="Keywords"
											onClick={this.props.closeLeftMenu}
									/>
								<MenuItem
											href="/keyideas/"
											primaryText="Key Ideas"
											onClick={this.props.closeLeftMenu}
									/>
								<MenuItem
											href="/commenters/"
											primaryText="Commenters"
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

								<Divider />

								{userIsLoggedIn ?
									<div>
										{Roles.userIsInRole(Meteor.userId(), ['developer', 'admin', 'commenter']) ?
											<div>
												<MenuItem
													href="/add-comment"
													primaryText="Add Comment"
													onClick={this.props.closeLeftMenu}
												/>
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
										}
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
