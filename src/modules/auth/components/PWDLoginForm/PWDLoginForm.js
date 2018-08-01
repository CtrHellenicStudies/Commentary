import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Link } from 'react-router-dom';

import './PWDLoginForm.css';


const wrapSubmit = login => async (values, dispatch) => {
	try {
		await login(values);
		return {};
	} catch (err) {
		console.error(err);
		throw new SubmissionError({ _error: 'Username or password incorrect.' });
	}
};

const renderField = ({ input, label, type, meta }) => (
	<div className="at-input form-group has-feedback">
		<input
			{...input}
			type={type}
			style={{width: '100%'}}
			placeholder={label}
			autoCapitalize="none"
			autoCorrect="off"
			autoComplete="off"
			spellCheck="false"
			required
		/>
		{meta.touched && meta.error && <span className="help-block">{meta.error}</span>}
	</div>
);


const PWDLoginForm = ({ error, handleSubmit, pristine, reset, submitting, login }) => (
	<div className="at-pwd-form">
		<form onSubmit={handleSubmit(wrapSubmit(login))}>
			<Field
				name="username"
				label="Email"
				type="email"
				component={renderField}
			/>
			<Field
				name="password"
				label="Password"
				type="password"
				component={renderField}
			/>
			<div className="at-pwd-link">
				<p className="error-text">
					{error}
				</p>
				<p>
					<Link
						to="/auth/forgot-password"
						id="at-forgotPwd"
						className="at-link at-pwd"
					>
						Forgot your password?
					</Link>
				</p>
			</div>
			<button
				type="submit"
				className="at-btn submit btn btn-lg btn-block btn-default"
				disabled={submitting}
			>
				Sign In
			</button>
		</form>
	</div>
);

PWDLoginForm.propTypes = {
	login: PropTypes.func.isRequired,
};
PWDLoginForm.defaultProps = {
	// error: null,
};


export default reduxForm({
	form: 'PWDLoginForm',
})(PWDLoginForm);
