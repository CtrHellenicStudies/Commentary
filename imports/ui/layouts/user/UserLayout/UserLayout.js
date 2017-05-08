import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// layouts & components
import Header from '/imports/ui/layouts/header/Header';
import Footer from '/imports/ui/components/footer/Footer';
import { SnackAttack } from '/imports/ui/components/shared/SnackAttack';
import LoadingPage from '/imports/ui/components/loading/LoadingPage';
import ProfilePage from '/imports/ui/components/user/ProfilePage';

// lib
import muiTheme from '/imports/lib/muiTheme';


const UserLayout = React.createClass({
	propTypes: {
		user: React.PropTypes.object,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},

	render() {
		const { user } = this.props;

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="chs-layout master-layout">
					<Header />

					<main>
						{user ?
							<ProfilePage user={user} />
							:
							<LoadingPage />
						}
					</main>

					<Footer />
					<SnackAttack />
				</div>
			</MuiThemeProvider>
		);
	},

});


const UserLayoutContainer = createContainer(() => {
	const user = Meteor.user();

	if (user && !('profile' in user)) {
		user.profile = {};
	}
	return {
		user,
	};
}, UserLayout);

export default UserLayoutContainer;
