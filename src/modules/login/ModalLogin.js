import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

// components:
import OAuthButtons from './OAuthButtons';
import PWDLoginForm from './PWDLoginForm';
import { login } from '../../lib/auth';


const ESCAPE_KEY = 27;


class ModalLogin extends Component {

	constructor(props) {
		super(props);

		this.state = {
			errorMsg: '',
			errorSocial: '',
		};

		// methods:
		this._handleKeyDown = this._handleKeyDown.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.signup = this.signup.bind(this);
		this.forgot = this.forgot.bind(this);
	}

	componentWillMount() {
		document.addEventListener('keydown', this._handleKeyDown);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this._handleKeyDown);
	}

	_handleKeyDown(event) {

		const { closeModal } = this.props;

		if (event.keyCode === ESCAPE_KEY) closeModal();
	}
	handleLogin(email, password) {
		login({ username: email, password: password });
	}
	signup() {
		this.props.closeModal();
		this.props.signupModal();
	}
	forgot(event) {
		event.preventDefault();
		this.props.closeModal();
		this.props.history.push('/forgot-password');
	}

	render() {

		const { lowered, closeModal } = this.props;
		const { errorSocial, errorMsg } = this.state;

		return (
			<div>
				{!Cookies.get('user') &&
					<div
						className={`ahcip-modal-login
						ahcip-modal ahcip-login-signup ${((lowered) ? ' lowered' : '')}`}
					>
						<div
							className="close-modal paper-shadow"
							onClick={closeModal}
						>
							<i className="material-icons">close</i>
						</div>
						<div className="modal-inner">
							<div className="at-form">

								<div className="at-title">
									<h3>Sign In</h3>
								</div>

								<span className="error-text">
									{errorSocial}
								</span>

								<OAuthButtons
								/>

								<div className="at-sep">
									<strong>OR</strong>
								</div>

								<PWDLoginForm
									login={this.handleLogin}
									errorMsg={errorMsg}
									closeModal={closeModal}
									history={this.props.history}
								/>

								<div className="at-signup-link">
									<p>
										Don't have an account? <a href="#signup" id="at-signUp" onClick={this.signup} className="at-link at-signup">Register.</a>
									</p>
								</div>
								<div className="at-resend-verification-email-link at-wrap">
									<p>
										Verification email lost? <a href="" onClick={this.forgot} id="at-resend-verification-email" className="at-link at-resend-verification-email">Send again.</a>
									</p>
								</div>
							</div>
						</div>
					</div>}
			</div>
		);
	}
}
ModalLogin.propTypes = {
	lowered: PropTypes.bool,
	closeModal: PropTypes.func,
	history: PropTypes.object,
	signupModal: PropTypes.func
};
ModalLogin.defaultProps = {
	lowered: false,
};

export default ModalLogin;
