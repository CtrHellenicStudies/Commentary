import React from 'react';
import {
	Field, reduxForm, SubmissionError
} from 'redux-form';
import autoBind from 'react-autobind';

import CommentCitation from './CommentCitation';
import CommentBodyEditor from './CommentBodyEditor';


import './CommentEditor.css'


class CommentEditor extends React.Component {

	constructor(props) {
		super(props)
		autoBind(this);
	}


	render() {

		return (
			<div className="commentEditor">
				<CommentCitation />
				<CommentBodyEditor />
			</div>
		);
	}
}


export default CommentEditor;
