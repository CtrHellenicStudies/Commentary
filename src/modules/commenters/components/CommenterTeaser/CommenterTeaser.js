import React from 'react';
import PropTypes from 'prop-types';
import _s from 'underscore.string';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// component
import AvatarIcon from '../../../users/components/AvatarIcon';

// lib
import muiTheme from '../../../../lib/muiTheme';

// commenter Teaser
class CommenterTeaser extends React.Component {

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	render() {
		const { commenter } = this.props;
		const commenterUrl = `/commenters/${commenter.slug}`;
		const commenterExcerpt = commenter.tagline ? _s.truncate(commenter.tagline, 120) : '';


		return (
			<div className="commenter-teaser hvr-grow wow fadeIn">
				<a href={commenterUrl}>
					<div className="commenter-image paper-shadow">
						{commenter && commenter.avatar ?
							<AvatarIcon avatar={commenter.avatar.src} />
							:
							<img
								src={commenter && commenter.avatar ? commenter.avatar : '/images/default_user.jpg'}
								alt={commenter.name}
							/>
						}
					</div>
				</a>
				<div className="commenter-teaser-text">
					<a href={commenterUrl}>
						<h3>{commenter.name}</h3>
					</a>
					<hr />
					<p className="commenter-description">
						{commenterExcerpt}
					</p>

				</div>
			</div>
		);
	}
}


CommenterTeaser.propTypes = {
	commenter: PropTypes.object
};

CommenterTeaser.childContextTypes = {
	muiTheme: PropTypes.object
};

export default CommenterTeaser;
