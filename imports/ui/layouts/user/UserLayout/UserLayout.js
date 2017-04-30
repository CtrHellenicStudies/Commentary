import React from 'react';
import { SnackAttack } from '/imports/ui/components/shared/SnackAttack';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import 'mdi/css/materialdesignicons.css';

// layouts & components
import Header from '/imports/ui/layouts/header/Header';
import Footer from '/imports/ui/components/footer/Footer';

const UserLayout = React.createClass({
	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	getMeteorData() {
		const user = Meteor.user();

		if (user && !('profile' in user)) {
			user.profile = {};
		}
		return {
			user,
		};
	},


	render() {
		return (
			<MuiThemeProvider>
				<div className="chs-layout master-layout">

					<Header  />

					<main>
						{this.data.user ?
							<ProfilePage user={this.data.user} />
							:
							<Loading />
						}
					</main>
					<Footer  />
					<SnackAttack />
				</div>
			</MuiThemeProvider>
		);
	},

});


export default UserLayout;
