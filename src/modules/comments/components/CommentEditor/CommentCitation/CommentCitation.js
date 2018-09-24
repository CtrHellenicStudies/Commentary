import React from 'react';
import { Field } from 'redux-form';


import CommentLemmaSelectContainer from '../CommentLemmaSelectContainer';
import CommentWorkSelect from '../../components/CommentWorkSelect';


const CommentCitation = props => (
	<div className="commentCitation">
		<CommentLemmaContainer
			urn={props.citationUrn}
		/>
		<FormGroup controlId="formControlsSelect">
			<ControlLabel>Work</ControlLabel>
			<Select
				name="work-select"
				value={selectedWork}
				options={workOptions}
				onChange={this.selectWork}
			/>
		</FormGroup>
		<FormGroup controlId="formControlsSelect">
			<ControlLabel>From</ControlLabel>
			<Field
				name="locationFrom0"
				type="number"
			/>
			<Field
				name="locationFrom1"
				type="number"
			/>
		</FormGroup>
		<FormGroup controlId="formControlsSelect">
			<ControlLabel>To</ControlLabel>
			<Field
				name="locationTo0"
				type="number"
			/>
			<Field
				name="locationTo1"
				type="number"
			/>
		</FormGroup>
	</div>
);


export default CommentCitation;
