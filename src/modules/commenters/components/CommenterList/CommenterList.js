import React from 'react';
import PropTypes from 'prop-types';


// components
import CommenterTeaser from '../CommenterTeaser/CommenterTeaser';


import './CommenterList.css'


const CommenterList = ({ commenters }) => {

	return (
		<div className="commenters-list">
			{commenters.map(commenter =>
				(<CommenterTeaser
					key={commenter._id}
					commenter={commenter}
				/>)
			)}
		</div>
	);
}

CommenterList.propTypes = {
	commenters: PropTypes.array,
};

CommenterList.defaultProps = {
	commenters: [],
};

export default CommenterList;
