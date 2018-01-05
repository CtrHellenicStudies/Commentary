import React from 'react';
import Cookies from 'js-cookie';

export default class ModalForgotPwd extends React.Component {
	constructor(props) {
		super(props);
		this.emailValue = this.emailValue.bind(this);
		this._handleKeyDown = this._handleKeyDown.bind(this);
		this.signup = this.signup.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			error: null
		};
	}

	componentWillMount() {
		document.addEventListener('keydown', this._handleKeyDown);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this._handleKeyDown);
	}

	emailValue(event) {
		this.setState({
			email: event.target.value
		});
	}

	_handleKeyDown(event) {

		const {closeModal} = this.props;

		if (event.keyCode === 'ESCAPE_KEY') closeModal();
	}

	signup(event) {
		event.preventDefault();
		this.props.closeModal();
		this.props.signupModal();
	}

	handleSubmit(event) {
        event.preventDefault();
        // TODO
		// Meteor.call('sendPasswordReminder', this.state.email, (err) => {
		// 	if (err) {
		// 		this.setState({
		// 			error: err
		// 		});
		// 	} else {
		// 		this.props.closeModal();
		// 	}
		// });

	}

	render() {
		const {closeModal, lowered} = this.props;

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
						<i className="mdi mdi-close" />
					</div>
					<div className="modal-inner">
						<div className="at-form">

							<div className="at-title">
								<h3>Reset your password</h3>
							</div>
							{this.state.error ?
								(<div className="at-error alert alert-danger">
									<p>User not found</p>
								</div>) : null
							}

							<form onSubmit={this.handleSubmit}>

								<div className="at-input form-group has-feedback">
									<label className="control-label" htmlFor="at-field-email">
										Email
									</label>
									<input
										type="email"
										className="form-control sign-in-input--email"
										id="at-field-email"
										name="at-field-email"
										placeholder="Email"
										autoCapitalize="none"
										autoCorrect="off"
										autoComplete="off"
										style={{
											backgroundImage: ' url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAkCAYAAADo6zjiAAAAAXNSR0IArs4c6QAAAvhJREFUWAndWDtrIlEUPo4SUVDUhbjrWqkgiYGNnWBhEPMPoizb+g8sUgk2Vlv6Hxa2lnSC5GFArLTQViWs0SImYKFgjHvOrHN3Xo6OOxLYC5N73ue75965c4wJcBSLxc+vr6/fkTxbLpc+khk1TCbTAGNdWyyWy3w+/0se17RK3sLEH+RKI3kE8oQgvshBcLTyfSenhVCOVZUl6+KQO5NI9ssocnFG77kWfrVcVIF3Hf83gKOjI8jlckDzurHXCkQiEXA6nUDzurFXAPju83mFWQ3EXgGoJZTLJACsVisEg0Fwu91yO9hVpwgkE1gE3uVyQTabBYfDAW9vb1Aul6HZbPLqXXVCbK2ZVSAWi/HJyZjjOEgmk8xvVx0LoEEwABo2e1UxAPV6HSaTCZ+MtqBarbLEu+pYAA3CVCgUloKeDprf74fxeAzPz8+CmJ+1dBLDDQy+ko9ocrPqDx4kADb4GqpGIGMEccq2wNDoWwTDL6OH+oN3A7DCmGD3wBagNU2Oj48hk8mstcHWD3DFEj1W4ZNhFbDZbJLg2zKGVUAMYD6fw3Q6lWDA1Up4gTEMgN1uF2JCq9WCq6srxmsRFnwdBmq9mpaTmk5cAY/HA+fn5/ye93o96Ha7ai68jCpwjc83nvuHP2IAgUAA6KGRSCTg/v4eKpWKanSObiSswpOqVofQbDavtY7H4xCNRlX1ZrzzJ6lU6gduw0cEQr+OHKqWG4SdTgdGoxE0Gg24u7uDwWAAoVAIBGBUIeHzLg71p2cSSzbQ4m/HBlNIp9OsH6TvS6lUUrgYdg+cnJzAwcEBS0C01+tl/MvLC6PFhGGv4cXFBX/qaaWz2Qx8Ph/g+WK5+v0+o8XEXwuxdEeaEh4eHiq8h8Mh1Go1hZwEugHgQX2kO1wejRqYcDjMN7R04OgmpJ6i3W7zB3OxWMhdgGLpBoBRbvD5Ko92e3sL9OgcN7oP4ereGOtMpDDH1VNDcqkbAP6H4wEdTzHATyqhIvIGAfmQL8WgWL8B6msZ8cYhQlQAAAAASUVORK5CYII=&quot;)',
											backgroundRepeat: 'no-repeat',
											backgroundAttachment: 'scroll',
											backgroundSize: '16px 18px',
											backgroundPosition: '98% 50%',
										}}
										onChange={this.emailValue}
									/>
									<span className="help-block hide" />
								</div>

								<button
									type="submit" className="at-btn submit btn btn-lg btn-block btn-default"
									id="at-btn"
								>
									Email reset link
								</button>

							</form>
							<div className="at-signup-link">
								<p>
									Don't have an account? <a
										href="" id="at-signUp" onClick={this.signup}
										className="at-link at-signup"
									>Register.</a>
								</p>
							</div>
						</div>
					</div>
				</div>}
			</div>
		);

	}
}
