import React from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import _s from 'underscore.string';

// lib
import muiTheme from '../../../../lib/muiTheme';


class ReferenceWorkTeaser extends React.Component {

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	createMarkup() {
		const { desc } = this.props;
		return {
			__html: desc ? _s.truncate(desc.replace(/(<([^>]+)>)/ig, ''), 140) : '',
		};
	}

	render() {
		const { referenceWork } = this.props;

		if (!referenceWork) {
			return null;
		}

		const referenceWorkUrl = `/referenceWorks/${referenceWork.slug}`;

		return (
			<div
				className="reference-work-teaser"
				data-wow-duration="0.2s"
				href={referenceWorkUrl}
			>
				<a
					className="reference-work-title-link"
					href={referenceWorkUrl}
				>
					<h4 className="reference-work-title">
						{referenceWork.title}
					</h4>
				</a>
				<hr />
				<span
					className="reference-work-description"
					dangerouslySetInnerHTML={this.createMarkup()}
				/>

				<a
					className="reference-work-read-more-link"
					href={referenceWorkUrl}
				>
					<span className="reference-work-read-more">
						READ MORE
					</span>
				</a>
			</div>
		);
	}

}


ReferenceWorkTeaser.propTypes = {
	referenceWork: PropTypes.object.isRequired,
};

ReferenceWorkTeaser.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};


export default ReferenceWorkTeaser;
