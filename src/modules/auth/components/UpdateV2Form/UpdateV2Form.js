import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';

// lib
import { resetPassword } from '../../../../lib/auth';

import './UpdateV2Form.css';



const wrapSubmit = resetPassword => async (values, dispatch) => {
	try {
		await resetPassword(values);
		return {};
	} catch (err) {
		console.error(err);
		throw new SubmissionError({ _error: 'Error resetting password.' });
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

const UpdateV2Form = ({ error, handleSubmit, pristine, reset, submitting }) => (
	<div className="authContainer">
		<div className="at-form">
			<div className="at-pwd-form forgotPwdForm">
				<div className="at-title">
					<h3>
						Welcome to the 2.0 version of the Classical Commentaries from the Center for Hellenic Studies!
					</h3>
					<p>
						Please reset your password to sign in.
					</p>
				</div>
				<form onSubmit={handleSubmit(wrapSubmit(resetPassword))}>
					<Field
						name="username"
						label="Email"
						type="email"
						component={renderField}
	  			/>
					<div className="at-pwd-link">
						<p>
	            To reset your password, enter the email address you use to sign in.
	  				</p>
						<p className="error-text">
							{error}
						</p>
					</div>
					<button
						type="submit"
						className="at-btn submit btn btn-lg btn-block btn-default"
						disabled={submitting}
	  			>
	          Get Reset Link
	  			</button>
				</form>
			</div>
		</div>
	</div>
);

const validate = (values) => {
	const errors = {};

	if (values.password !== values.passwordRepeat) {
		errors.passwordRepeat = 'Passwords do not match';
	}

	return errors;
};

export default reduxForm({
	form: 'UpdateV2Form',
	validate,
})(UpdateV2Form);
