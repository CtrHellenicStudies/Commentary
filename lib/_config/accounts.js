AccountsTemplates.configure({
	defaultLayoutType: 'blaze-to-react',
	defaultLayout: MainLayout,
	defaultContentRegion: 'content',
	confirmPassword: false,
	enablePasswordChange: true,
	forbidClientAccountCreation: false,
	overrideLoginErrors: true,
	sendVerificationEmail: false,
	lowercaseUsername: false,
	showAddRemoveServices: true,
	showForgotPasswordLink: true,
	showLabels: true,
	showPlaceholders: true,
	showResendVerificationEmailLink: false,
	continuousValidation: false,
	negativeFeedback: false,
	negativeValidation: true,
	positiveValidation: false,
	positiveFeedback: true,
	showValidating: true,
	privacyUrl: Config.privacyUrl || null,
	termsUrl: Config.termsUrl || null,
});

/*
 * Account routes
 */

AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
