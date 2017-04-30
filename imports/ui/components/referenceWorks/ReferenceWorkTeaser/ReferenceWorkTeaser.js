import React from 'react';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

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
		return { muiTheme: getMuiTheme(baseTheme) };
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
		const referenceWork = this.props.referenceWork;
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
