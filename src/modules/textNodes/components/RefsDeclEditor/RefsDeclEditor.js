import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';

import './RefsDeclEditor.css';


const renderField = ({ input, label, type, meta: { touched, error } }) => (
	<div>
		<div>
			<input {...input} type={type} placeholder={label} />
			{touched && error && <span clasName="error">{error}</span>}
		</div>
	</div>
)


const renderRefsDecls = ({ fields, meta: { error, submitFailed } }) => (
	<ul className="refsDeclFields">
		{fields.map((field, index) => (
			<li
				key={index}
				className="refsDecl"
			>
				<Field
					name={`${field}.label`}
					type="text"
					component={renderField}
				/>
				<button
					type="button"
					className="removeButton"
					onClick={() => fields.remove(index)}
				>
					<i className="mdi mdi-close" />
				</button>
			</li>
		))}
		<li>
			<button type="button" onClick={() => fields.push({})}>
        + Add
			</button>
			{submitFailed && error && <span>{error}</span>}
		</li>
	</ul>
);


const RefsDeclEditor = props => {
	const { handleSubmit, submitting } = props
	return (
		<form
			className="refsDeclEditor"
			onSubmit={handleSubmit}
		>
			<FieldArray name="refsDecls" component={renderRefsDecls} />
			<div>
				<button type="submit" disabled={submitting}>
          Update
				</button>
			</div>
		</form>
	)
};

export default reduxForm({
	form: 'RefsDeclEditor', // a unique identifier for this form
})(RefsDeclEditor);
