import React from 'react';
import PropTypes from 'prop-types';

const OAuthButtons = ({ handleFacebook, handleGoogle, handleTwitter }) => (
	<div className="at-oauth">
		{handleFacebook &&
			<button
				className="btn at-social-btn"
				id="at-facebook"
				name="facebook"
				onClick={handleFacebook}
			>
				<i className="fa fa-facebook" /> Sign In with Facebook
			</button>}

		{handleGoogle &&
			<button
				className="btn at-social-btn"
				id="at-google"
				name="google"
				onClick={handleGoogle}
			>
				<i className="fa fa-google" /> Sign In with Google
			</button>}

		{handleTwitter &&
			<button
				className="btn at-social-btn"
				id="at-twitter"
				name="twitter"
				onClick={handleTwitter}
			>
				<i className="fa fa-twitter" /> Sign In with Twitter
			</button>}
	</div>
);
OAuthButtons.propTypes = {
	handleFacebook: PropTypes.func,
	handleGoogle: PropTypes.func,
	handleTwitter: PropTypes.func,
};
OAuthButtons.defaultProps = {
	handleFacebook: null,
	handleGoogle: null,
	handleTwitter: null,
};

export default OAuthButtons;
