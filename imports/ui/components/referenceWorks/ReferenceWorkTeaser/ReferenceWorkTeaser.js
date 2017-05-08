import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// lib
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';

const ReferenceWorkTeaser = React.createClass({

	propTypes: {
		referenceWork: React.PropTypes.object.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			open: false,
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},

	toggleOpen() {
		this.setState({
			open: !this.state.open,
		});
	},

	createMarkup() {
		return {
			__html: Utils.trunc(this.props.referenceWork.description.replace(/(<([^>]+)>)/ig, ''), 140),
		};
	},

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
	},

});

export default ReferenceWorkTeaser;
