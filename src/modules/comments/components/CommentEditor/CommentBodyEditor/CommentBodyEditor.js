import React from 'react';
import { Field } from 'redux-form';

// lib
import { maxLength } from '../../../../../lib/formHelpers';

// component
import Editor from '../../../../editor/components/Editor';


import './CommentBodyEditor.css';


const CommentBodyEditor = props => (
	<div className="commentBodyEditor">
		<div className="commentEditorFormInputOuter commentEditorFormTitleOuter">
			<Field
				name="title"
				type="text"
				className="commentTitleInput"
				component="textarea"
				placeholder="Title of the comment . . ."
				required
			/>
		</div>
		<div className="commentBodyEditorContentEditor">
			{/** Comment editor must be outside of form to prevent wrongful submits on button clicks */}
			<Editor />
		</div>
	</div>
);


export default CommentBodyEditor;
