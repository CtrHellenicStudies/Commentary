import React from 'react';

import { Accounts } from 'meteor/accounts-base';
import cookie from 'react-cookie'; // eslint-disable-line import/no-unresolved

// components:
import OAuthButtons from '/imports/ui/components/auth/OAuthButtons'; // eslint-disable-line import/no-absolute-path
import PWDSignupForm from '/imports/ui/components/auth/PWDSignupForm'; // eslint-disable-line import/no-absolute-path

class ModalSignup extends React.Component {
	static propTypes = {
		lowered: React.PropTypes.bool,
		closeModal: React.PropTypes.func.isRequired,
	};

	static defaultProps = {
		lowered: false,
	};

	constructor(props) {
		super(props);

		this.state = {
			errorMsg: '',
			errorSocial: '',
		};

		// methids
		this.handleSignup = this.handleSignup.bind(this);
		this.handleSignupFacebook = this.handleSignupFacebook.bind(this);
		this.handleSignupGoogle = this.handleSignupGoogle.bind(this);
		this.handleSignupTwitter = this.handleSignupTwitter.bind(this);
	}

	handleSignup(email, password, passwordRepeat) {

		if (password !== passwordRepeat) {
			this.setState({
				errorMsg: 'Passwords do not match.',
			});
			throw new Meteor.Error('Passwords do not match');
		}

		const checkPassword = Accounts._hashPassword(password);

		Meteor.call('createAccount', { email, checkPassword }, (err, result) => {
			const path = '/';

			if (!err) {
				Meteor.loginWithToken(result.stampedToken.token, (_err) => {
					if (_err) {
						this.setState({
							errorMsg: 'Invalid email or password',
						});
					}

					cookie.save('userId', result.userId, { path });
					cookie.save('loginToken', result.stampedToken.token, { path });
					this.props.closeModal();
				});
			} else {
				this.setState({
					errorMsg: 'Invalid email or password',
				});
			}
		});
	}

	handleSignupFacebook() {
		Meteor.loginWithFacebook({}, (err) => {
			if (!err) {
				this.props.closeModal();
			} else {
				this.setState({
					errorSocial: `Error with signing in with Facebook: ${err.reason}`,
				});
			}
		});
	}

	handleSignupGoogle() {
		Meteor.loginWithGoogle({}, (err) => {
			if (!err) {
				this.props.closeModal();
			} else {
				this.setState({
					errorSocial: `Error with signing in with Google: ${err.reason}`,
				});
			}
		});
	}

	handleSignupTwitter() {
		Meteor.loginWithTwitter({}, (err) => {
			if (!err) {
				this.props.closeModal();
			} else {
				this.setState({
					errorSocial: `Error with signing in with Twitter: ${err.reason}`,
				});
			}
		});
	}

	render() {
		const { lowered, closeModal } = this.props;
		const { errorMsg, errorSocial } = this.state;

		return (
			<div
				className={`ahcip-modal-signup ahcip-modal ahcip-login-signup
					${((lowered) ? ' lowered' : '')}`}
			>
				<div  // eslint-disable-line jsx-a11y/no-static-element-interactions
					className="close-modal paper-shadow"
					onClick={closeModal}
				>
					<i className="mdi mdi-close" />
				</div>
				<div className="modal-inner">
					<div className="at-form">
						<div className="at-title">
							<h3>Create an Account</h3>
						</div>
						<span className="error-text">
							{errorSocial}
						</span>
						<OAuthButtons
							handleFacebook={this.handleSignupFacebook}
							handleGoogle={this.handleSignupGoogle}
							handleTwitter={this.handleSignupTwitter}
						/>
						<div className="at-sep">
							<strong>OR</strong>
						</div>

						<PWDSignupForm
							handleSignup={this.handleSignup}
							errorMsg={errorMsg}
						/>

						<div className="at-signup-link">
							<div className="at-resend-verification-email-link at-wrap">
								<p>
									By clicking register, you agree to our <a href="/terms" className="at-link at-link--terms at-resend-verification-email">Terms and Privacy Policy.</a>
								</p>
							</div>
							<p>
								Already have an account? <a href="/sign-in" id="at-signUp" className="at-link at-signup">Sign in.</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ModalSignup;
