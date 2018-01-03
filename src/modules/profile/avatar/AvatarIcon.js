import React from 'react';
import PropTypes from 'prop-types';

export default function AvatarIcon(props) {
	let url = '/images/default_user.jpg';

	if (props.avatar) {
		url = props.avatar;
	} else if (props.defaultUrl) {
		url = props.defaultUrl;
	}
	url = url.replace(/\s/g, '', 'X');

	return <div className="avatar-icon" style={{backgroundImage: `url(${url})`}} alt="icon" />;
}

AvatarIcon.propTypes = {
	defaultUrl: PropTypes.string,
	avatar: PropTypes.string,
};
