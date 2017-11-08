import React from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// lib
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';

class ReferenceWorkTeaser extends React.Component {

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	createMarkup() {
		let { desc } = this.props;
		return {
			__html: desc ? Utils.trunc(desc.replace(/(<([^>]+)>)/ig, ''), 140) : '',
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
