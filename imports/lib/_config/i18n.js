import Config from './_config.js';

/**
 * Set default language for internationalization
 */
Meteor.startup(() => {
	if (Meteor.isClient) {
		if (Config.defaultLanguage) {
			return TAPi18n.setLanguage(Config.defaultLanguage);
		}

		return TAPi18n.setLanguage('en');
	}

	return false;
});
