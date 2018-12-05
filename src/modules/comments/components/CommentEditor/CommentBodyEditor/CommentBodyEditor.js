import React from 'react';
import { Creatable } from 'react-select';
import { Field } from 'redux-form';

// component
import Editor from '../../../../editor/components/Editor';
import TagsInput from '../TagsInput';
import ReferenceWorksInput from '../ReferenceWorksInput';
import CommentersInput from '../CommentersInput';


import './CommentBodyEditor.css';


const CommentBodyEditor = props => (
	<div className="commentBodyEditor">
		<div className="commentEditorInput commentEditorTitleOuter">
			<input
				name="title"
				type="text"
				className="commentTitleInput"
				placeholder="Title of the comment . . ."
				required
			/>
		</div>

		<div className="commentEditorInput commentEditorCommentersInput">
			<label>Commenters</label>
			<CommentersInput />
		</div>

		<div className="commentEditorInput commentEditorTagsInput">
			<label>Tags</label>
			<TagsInput />
		</div>

		<div className="commentEditorInput commentBodyEditorContentEditor">
			<Editor />
		</div>

		<div className="commentEditorInput commentEditorReferenceWorkInput">
			<label>Reference works</label>
			<ReferenceWorksInput />
		</div>
	</div>
);


export default CommentBodyEditor;
