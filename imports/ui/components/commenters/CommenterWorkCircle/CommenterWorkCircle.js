import React from 'react';
import PropTypes from 'prop-types';

const CommenterWorkCircle = props => (

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
	toggleVisibleWork: PropTypes.func.isRequired,
	workTitle: PropTypes.string.isRequired,
	workSlug: PropTypes.string.isRequired,
	workLevel: PropTypes.number.isRequired,
	nComments: PropTypes.number.isRequired,
};

export default CommenterWorkCircle;
