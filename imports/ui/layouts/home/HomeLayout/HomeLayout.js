import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// api
import Settings from '/imports/api/collections/settings';

// layouts
import Header from '/imports/ui/layouts/header/Header';
import Footer from '/imports/ui/components/footer/Footer';

// components
import Home from '/imports/ui/components/home/Home';
import LoadingHome from '/imports/ui/components/loading/LoadingHome';


const HomeLayout = React.createClass({
	propTypes: {
		settings: React.PropTypes.object,
		ready: React.PropTypes.bool,
	},

	getInitialState() {
		return {
			filters: [],
		};
	},

	componentDidMount() {
		if (typeof location.hash !== 'undefined' && location.hash.length > 0) {
			setTimeout(() => {
				$('html, body').animate({ scrollTop: $(location.hash).offset().top - 100 }, 300);
			}, 1000);
		}
	},

	render() {
		const { settings } = this.props;

		if (!settings) {
			return <LoadingHome />;
		}

		return (
			<MuiThemeProvider>
				<div className="chs-layout home-layout">
					<Header
						isOnHomeView
					/>

					<Home
						settings={settings}
					/>

					<Footer />
				</div>
			</MuiThemeProvider>
		);
	},

});

const HomeLayoutContainer = createContainer(() => {
	const handle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

	return {
		settings: Settings.findOne(),
		ready: handle.ready(),
	};
}, HomeLayout);

export default HomeLayoutContainer;
