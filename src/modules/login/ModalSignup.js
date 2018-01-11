import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { register } from '../../lib/auth';

// components:
import OAuthButtons from './OAuthButtons';
import PWDSignupForm from './PWDSignupForm';

class ModalSignup extends Component {

	constructor(props) {
		super(props);

		this.state = {
			errorMsg: '',
			errorSocial: '',
		};

		// methids
		this._handleKeyDown = this._handleKeyDown.bind(this);
		this.handleSignup = this.handleSignup.bind(this);
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
		register({username: email, password: checkPassword});

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
