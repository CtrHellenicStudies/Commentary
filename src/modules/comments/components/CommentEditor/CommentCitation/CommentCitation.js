import React from 'react';

// component
import TextNodesContainer from '../../../../textNodes/containers/TextNodesContainer';
import WorkInput from '../WorkInput';

import './CommentCitation.css';


const textNodesUrn ='urn:cts:greekLit:tlg0012.tlg001:1.1';

const CommentCitation = props => (
	<div className="commentCitation">
		<TextNodesContainer
			textNodesUrn={props.citationUrn || textNodesUrn}
		/>
		<div className="commentCitationInput">
			<WorkInput />
		</div>
		<div className="commentCitationInput">
			<label>From</label>
			<div className="locationInput">
				<label>Book</label>
				<input
					type="number"
				/>
				<label>Line</label>
				<input
					type="number"
				/>
			</div>
		</div>
		<div className="commentCitationInput">
			<label>To</label>
			<div className="locationInput">
				<label>Book</label>
				<input
					type="number"
				/>
				<label>Line</label>
				<input
					type="number"
				/>
			</div>
		</div>
	</div>
);


export default CommentCitation;
