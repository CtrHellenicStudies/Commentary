// import slug from 'slug';
// import AccountsLayout from '/imports/ui/layouts/accounts/AccountsLayout';
// import Config from './_config.js';
//
//
AccountsTemplates.configure({
// 	defaultLayoutType: 'blaze-to-react',
// 	defaultLayout: AccountsLayout,
// 	defaultContentRegion: 'content',
// 	confirmPassword: true,
 	enablePasswordChange: true,
// 	forbidClientAccountCreation: false,
// 	overrideLoginErrors: true,
// 	sendVerificationEmail: true,
// 	lowercaseUsername: false,
// 	showAddRemoveServices: true,
// 	showForgotPasswordLink: true,
// 	showLabels: true,
// 	showPlaceholders: true,
// 	showResendVerificationEmailLink: true,
// 	continuousValidation: false,
// 	negativeFeedback: false,
// 	negativeValidation: true,
// 	positiveValidation: false,
// 	positiveFeedback: true,
// 	showValidating: true,
// 	privacyUrl: Config.privacyUrl || null,
// 	termsUrl: Config.termsUrl || null,
});
//
// /*
//  * Account routes
//  */
//
// AccountsTemplates.configureRoute('changePwd');
// AccountsTemplates.configureRoute('forgotPwd');
// AccountsTemplates.configureRoute('resetPwd');
// AccountsTemplates.configureRoute('signIn');
// AccountsTemplates.configureRoute('signUp');
// AccountsTemplates.configureRoute('verifyEmail');
// AccountsTemplates.configureRoute('resendVerificationEmail');
//
//
if (Meteor.isServer) {
	/**
	 * When a user account is created, ensure username is generated properly
	 */
	Accounts.onCreateUser((options, user) => {
		let username = '';
		if (!('emails' in user)) {
			user.emails = [];
		}

		if (user.emails.length) {
			username = slug(user.emails[0].address.split('@')[0]);
		}

		if ('facebook' in user.services) {
			username = slug(user.services.facebook.name);
			user.emails.push({
				address: user.services.facebook.email,
				verified: true,
			});
		}
		if ('google' in user.services) {
			username = slug(user.services.google.name);
			user.emails.push({
				address: user.services.google.email,
				verified: true,
			});
		}
		if ('twitter' in user.services) {
			username = slug(user.services.twitter.screenName);
		}

		user.username = username;
		check(user, Schemas.User);
		return user;
	});
}
