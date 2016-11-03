import React from 'react';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

ReferenceWorkTeaser = React.createClass({

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

	render() {
		const referenceWork = this.props.referenceWork;
		const referenceWorkUrl = `/referenceWorks/${referenceWork.slug}`;
		let referenceWorkClass = 'referenceWork-teaser clearfix wow fadeInUp ';
		if (this.state.open) {
			referenceWorkClass += 'referenceWork-open';
		}


		return (<div
			className={referenceWorkClass}
			data-wow-duration="0.2s"
			onClick={this.toggleOpen}
  >
			<h4 className="reference-work-title">
				{referenceWork.title}
			</h4>
			<i className="mdi mdi-plus" />
			<i className="mdi mdi-minus" />
			<span className="reference-work-comment-count">({referenceWork.count} Comments)</span>
			<hr />
			<span
				className="reference-work-description"
			> {
					referenceWork.description
					|| `Quid faciat laetas segetes quo sidere terram vertere Mycenas ulmisque
					adiungere vites conveniat quae curum boum qui cultus habendo sit pecori
					apibus quanta experientia parcis, hinc canere incipiam`
			} </span>
			<a
				className="reference-work-read-more"
				href={referenceWorkUrl}
			>
				Read more
			</a>
		</div>);
	},

});
