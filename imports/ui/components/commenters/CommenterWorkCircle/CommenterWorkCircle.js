import React from 'react';

const CommenterWorkCircle = (props) => (

	<div className="commenter-work-circle">
		<div
			className={`circle-inner circle-level-${props.workLevel}`}
			onClick={props.toggleVisibleWork.bind(null, props.workSlug)}
		>
			<span className="work-title">{props.workTitle}</span>
			<span className="work-count">{props.nComments}</span>
			<div className="grow-border" />
		</div>
	</div>
);


CommenterWorkCircle.propTypes = {
	toggleVisibleWork: React.PropTypes.func.isRequired,
	workTitle: React.PropTypes.string.isRequired,
	workSlug: React.PropTypes.string.isRequired,
	workLevel: React.PropTypes.number.isRequired,
	nComments: React.PropTypes.number.isRequired,
};

export default CommenterWorkCircle;
