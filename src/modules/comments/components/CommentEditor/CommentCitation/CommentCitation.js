import React from 'react';
import { Field } from 'redux-form';
import {
	FormGroup,
	ControlLabel,
	FormControl,
} from 'react-bootstrap';


// component
import TextNodesContainer from '../../../../textNodes/containers/TextNodesContainer';

import './CommentCitation.css';


const textNodesUrn ='urn:cts:greekLit:tlg0012.tlg001:1.1';

const CommentCitation = props => (
	<div className="commentCitation">
		<TextNodesContainer
			textNodesUrn={props.citationUrn || textNodesUrn}
		/>
		<FormGroup>
			<ControlLabel>Work</ControlLabel>
      {/*
			<Select
				name="work-select"
				value={selectedWork}
				options={workOptions}
				onChange={this.selectWork}
			/>
      */}
		</FormGroup>
		<FormGroup>
			<ControlLabel>From</ControlLabel>
      {/*
			<Field
				name="locationFrom0"
			/>
			<Field
				name="locationFrom1"
			/>
      */}
		</FormGroup>
		<FormGroup>
			<ControlLabel>To</ControlLabel>
      {/*
			<Field
				name="locationTo0"
			/>
			<Field
				name="locationTo1"
			/>
      */}
		</FormGroup>
	</div>
);


export default CommentCitation;
