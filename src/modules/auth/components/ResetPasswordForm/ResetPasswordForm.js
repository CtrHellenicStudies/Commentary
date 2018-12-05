import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';

// lib
import { resetPassword } from '../../lib/auth';

import './ResetPasswordForm.css';



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

const ResetPasswordForm = ({ error, handleSubmit, pristine, reset, submitting }) => (
	<div className="authContainer">
		<div className="at-form">
			<div className="at-pwd-form resetPwdForm">
				<div className="at-title">
					<h3>
						Set a new password
					</h3>
				</div>
				<form onSubmit={handleSubmit(wrapSubmit(resetPassword))}>
					<Field
						name="password"
						label="Password"
						type="password"
						component={renderField}
					/>
					<Field
						name="passwordRepeat"
						label="Password (Again)"
						type="password"
						component={renderField}
					/>
					<div className="at-pwd-link">
						<p className="error-text">
							{error}
						</p>
					</div>
					<button
						type="submit"
						className="at-btn submit btn btn-lg btn-block btn-default"
						disabled={submitting}
	  			>
						Save new password
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
	form: 'ResetPasswordForm',
	validate,
})(ResetPasswordForm);
