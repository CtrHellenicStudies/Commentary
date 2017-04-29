import Config from '/imports/lib/_config/_config';

/**
 * Account email template
 */

Accounts.emailTemplates.siteName = Config.title;
Accounts.emailTemplates.from = `${Config.title} <no-reply@ahcip.chs.harvard.edu>`;
Accounts.emailTemplates.verifyEmail = {
	subject() {
		return 'Account Registration Confirmation';
	},
	text(user, url) {
		let username = 'Commentary User';

		if ('username' in user) {
			username = user.username;
		}

		return `Dear ${username},

			Please click the link below to verify your email account.

			${url}

			If you didn't request this email, you can ignore it.

			${Config.title}`;
	},
	html(user, url) {
		SSR.compileTemplate('verifyEmail', Assets.getText('verify_email.html'));

		const html = SSR.render('verifyEmail', { url, user });
		return html;
	},
};
