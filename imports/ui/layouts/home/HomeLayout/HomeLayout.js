import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// api
import Settings from '/imports/collections/settings';

// layouts
import Header from '/imports/ui/layouts/header/Header';
import Footer from '/imports/ui/components/footer/Footer';

const HomeLayout = React.createClass({
	mixins: [ReactMeteorData],

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

	getMeteorData() {
		const handle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

		return {
			settings: Settings.findOne(),
			ready: handle.ready(),
		};
	},

	render() {
		const { settings } = this.data;

		if (!settings) {
			return <Loading />;
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

export default HomeLayout;
