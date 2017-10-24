import Config from './_config.js';

let options;
if (Meteor.isServer) {
	/**
	 * Configure options for PrettyEmail email package with Meteor
	 */
	options = {
		siteName: Config.name,
	};

	if (Config.socialMedia) {
		_.each(Config.socialMedia, (v, k) => {
			options[k] = v.url;
		});
	}

	if (Config.legal) {
		options.companyAddress = Config.legal.address;
		options.companyName = Config.legal.name;
		options.companyUrl = Config.legal.url;
	}

	PrettyEmail.options = options;
}
