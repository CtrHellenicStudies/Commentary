import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// components:
import OAuthButtons from './OAuthButtons';
import PWDSignupForm from './PWDSignupForm';

class ModalSignup extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			errorMsg: '',
			errorSocial: '',
		};

		// methids
		this._handleKeyDown = this._handleKeyDown.bind(this);
		this.handleSignup = this.handleSignup.bind(this);
		this.handleSignupFacebook = this.handleSignupFacebook.bind(this);
		this.handleSignupGoogle = this.handleSignupGoogle.bind(this);
		this.handleSignupTwitter = this.handleSignupTwitter.bind(this);
		this.goToSigIn = this.goToSigIn.bind(this);
	}

	componentWillMount() {
		document.addEventListener('keydown', this._handleKeyDown);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this._handleKeyDown);
	}

	_handleKeyDown(event) {

		const { closeModal } = this.props;
		if (event.keyCode === 27) closeModal();
	}

	handleSignup(email, checkPassword, passwordRepeat) {

		if (checkPassword !== passwordRepeat) {
			this.setState({
				errorMsg: 'Passwords do not match.',
			});
			throw new Error('Passwords do not match');
		}

		//const password = Accounts._hashPassword(checkPassword);

		// Meteor.call('createAccount', { email, password }, (err, result) => {
		// 	const path = '/';
		// 	if (!err) {
		// 		Meteor.loginWithToken(result.stampedToken.token, (_err) => {
		// 			if (_err) {
		// 				this.setState({
		// 					errorMsg: 'Invalid email or password',
		// 				});

		// 				return false;
		// 			}

		// 			const domain = Utils.getEnvDomain();

		// 			if (domain) {
		// 				Cookies.set('userId', Meteor.userId(), { domain });
		// 				Cookies.set('loginToken', result.stampedToken.token, { domain });
		// 			} else {
		// 				Cookies.set('userId', Meteor.userId());
		// 				Cookies.set('loginToken', result.stampedToken.token);
		// 			}
		// 			this.props.closeModal();
		// 		});
		// 	} else {
		// 		this.setState({
		// 			errorMsg: 'Invalid email or password',
		// 		});
		// 	}
		// }); TODO
	}

	handleSignupFacebook() {
		// Meteor.loginWithFacebook({}, (err) => {
		// 	if (!err) {
		// 		this.props.closeModal();
		// 	} else {
		// 		this.setState({
		// 			errorSocial: `Error with signing in with Facebook: ${err.reason}`,
		// 		});
		// 	}
		// }); TODO
	}

	handleSignupGoogle() {
		// Meteor.loginWithGoogle({}, (err) => {
		// 	if (!err) {
		// 		this.props.closeModal();
		// 	} else {
		// 		this.setState({
		// 			errorSocial: `Error with signing in with Google: ${err.reason}`,
		// 		});
		// 	}
		// }); TODO
	}

	handleSignupTwitter() {
		// Meteor.loginWithTwitter({}, (err) => {
		// 	if (!err) {
		// 		this.props.closeModal();
		// 	} else {
		// 		this.setState({
		// 			errorSocial: `Error with signing in with Twitter: ${err.reason}`,
		// 		});
		// 	}
		// }); TODO
	}

	goToSigIn(event) {
		event.preventDefault();
		this.props.closeModal();
		this.props.loginModal();
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
							signup={this.handleSignup}
							errorMsg={errorMsg}
						/>

						<div className="at-signup-link">
							<div className="at-resend-verification-email-link at-wrap">
								<p>
									By clicking register, you agree to our <Link to="/terms" className="at-link at-link--terms at-resend-verification-email">Terms and Privacy Policy.</Link>
								</p>
							</div>
							<p>
								Already have an account? <a href="" onClick={this.goToSigIn} id="at-signUp" className="at-link at-signup">Sign in.</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
ModalSignup.propTypes = {
	lowered: PropTypes.bool,
	closeModal: PropTypes.func,
	loginModal: PropTypes.func,
};
ModalSignup.defaultProps = {
	lowered: false,
};
export default ModalSignup;
