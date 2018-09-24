import React from 'react';
import { Field } from 'redux-form';

// lib
import { maxLength } from '../../../../../lib/formHelpers';

// component
import ArticleTextEditor from '../../../../articles/components/ArticleTextEditor';


import './CommentBodyEditor.css';

const maxLength2000 = maxLength(2000);

const CommentBodyEditor = props => (
	<div className="commentBodyEditor">
		<div className="commentEditorFormInputOuter commentEditorFormTitleOuter">
			<Field
				name="title"
				type="text"
				className="commentTitleInput"
				component="textarea"
				placeholder="Title of the comment . . ."
				validate={[maxLength2000]}
				required
			/>
		</div>
		<div className="commentBodyEditorContentEditor">
			{/** Article text editor must be outside of form to prevent wrongful submits on button clicks */}
			<ArticleTextEditor
				editorState={props.editorState}
				config={{
					data_storage: {
						url: '/articles/x',
						method: 'POST',
						success_handler: null,
						failure_handler: null,
						interval: 500,
						save_handler: props.handleEditorChange
					}
				}}
			/>
		</div>
	</div>
);


export default CommentBodyEditor;
