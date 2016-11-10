import React from 'react';
import { SnackAttack } from '/imports/ui/components/SnackAttack.jsx';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import '../../node_modules/mdi/css/materialdesignicons.css';

UserLayout = React.createClass({
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
			<div className="chs-layout master-layout">

				<Header />

				<main>
					{this.data.user ?
						<ProfilePage user={this.data.user} />
						:
						<Loading />
					}
				</main>
				<Footer />
				<SnackAttack />
			</div>
		);
	},

});
