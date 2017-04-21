// components:
import OAuthButtons from '/imports/ui/components/auth/OAuthButtons';  // eslint-disable-line import/no-absolute-path
import PWDLoginForm from '/imports/ui/components/auth/PWDLoginForm';  // eslint-disable-line import/no-absolute-path

class ModalLogin extends React.Component {

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

		// methods:
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLoginFacebook = this.handleLoginFacebook.bind(this);
		this.handleLoginGoogle = this.handleLoginGoogle.bind(this);
		this.handleLoginTwitter = this.handleLoginTwitter.bind(this);
	}

	handleLogin(email, password) {
		Meteor.loginWithPassword(email, password, (err) => {
			if (!err) {
				this.props.closeModal();

			} else {
				this.setState({
					errorMsg: 'Invalid email or password',
				});
			}
		});
	}

	handleLoginFacebook() {
		Meteor.loginWithFacebook({}, (err) => {
			if (!err) {
				this.props.closeModal();
			} else {
				this.setState({
					errorSocial: `Error with signing in with Facebook: ${err.message}`,
				});
			}
		});
	}

	handleLoginGoogle() {
		Meteor.loginWithGoogle({}, (err) => {
			if (!err) {
				this.props.closeModal();
			} else {
				this.setState({
					errorSocial: `Error with signing in with Google: ${err.message}`,
				});
			}
		});
	}

	handleLoginTwitter() {
		Meteor.loginWithTwitter({}, (err) => {
			if (!err) {
				this.props.closeModal();
			} else {
				this.setState({
					errorSocial: `Error with signing in with Twitter: ${err.message}`,
				});
			}
		});
	}

	render() {

		const { lowered, closeModal } = this.props;
		const { errorSocial, errorMsg } = this.state;

		return (
			<div>
				{!Meteor.userId() &&
					<div
						className={`ahcip-modal-login
						ahcip-modal ahcip-login-signup ${((lowered) ? ' lowered' : '')}`}
					>
						<div
							className="close-modal paper-shadow"
							onClick={closeModal}
						>
							<i className="mdi mdi-close" />
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
									handleFacebook={this.handleLoginFacebook}
									handleGoogle={this.handleLoginGoogle}
									handleTwitter={this.handleLoginTwitter}
								/>

								<div className="at-sep">
									<strong>OR</strong>
								</div>

								<PWDLoginForm
									login={this.handleLogin}
									errorMsg={errorMsg}
								/>
								
								<div className="at-signup-link">
									<p>
										Don't have an account? <a href="/sign-up" id="at-signUp" className="at-link at-signup">Register.</a>
									</p>
								</div>
								<div className="at-resend-verification-email-link at-wrap">
									<p>
										Verification email lost? <a href="/send-again" id="at-resend-verification-email" className="at-link at-resend-verification-email">Send again.</a>
									</p>
								</div>
							</div>
						</div>
					</div>}
			</div>
		);
	}
}

export default ModalLogin;