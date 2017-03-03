import Settings from '/imports/collections/settings';

HomeLayout = React.createClass({
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
		const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

		return {
			settings: settingsHandle.ready() ? Settings.findOne() : { title: '' }
		};
	},

	render() {
		return (
			<div className="chs-layout home-layout">
				<Header
					isOnHomeView
				/>

				<HomeView
					settings={this.data.settings}
				/>

				<Footer />

			</div>
		);
	},

});
