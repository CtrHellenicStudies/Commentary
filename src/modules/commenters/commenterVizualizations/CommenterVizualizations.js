import React, { Component } from 'react';
import PropTypes from 'prop-types';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

// lib:
import muiTheme from '../../../lib/muiTheme';

// components
import CommenterWorkCircle from './CommenterWorkCircle';
import CommenterWorkVisualization from './CommenterWorkVisualization';


class CommenterVisualizations extends Component {

	constructor(props) {
		super(props);

		this.state = {
			visibleWork: '',
		};

		this.toggleVisibleWork = this.toggleVisibleWork.bind(this);
	}

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	toggleVisibleWork(workToToggle) {
		if (this.state.visibleWork === workToToggle) {
			this.setState({
				visibleWork: '',
			});
		} else {
			this.setState({
				visibleWork: workToToggle,
			});
		}
	}

	renderWorks() {
		const { commenter, isTest } = this.props;

		if (commenter.nCommentsWorks) {
			return commenter.nCommentsWorks.map((work, i) =>
				(<CommenterWorkVisualization
					key={i}
					toggleVisibleWork={this.toggleVisibleWork}
					work={work}
					commenterSlug={commenter.slug}
					isTest={isTest}
				/>)
			);
		}
		return '';
	}

	render() {
		const { commenter } = this.props;

		let classes = 'commenter-visualizations';
		if (this.state.visibleWork.length) {
			classes += ` commenter-visualizations-${this.state.visibleWork}-visible`;
		}

		let workIliadLevel = 0;
		let workOdysseyLevel = 0;
		let workHymnsLevel = 0;

		if (commenter.nCommentsIliad > 0) {
			workIliadLevel = Math.floor((commenter.nCommentsIliad / commenter.nCommentsTotal) * 10);
		}

		if (commenter.nCommentsOdyssey > 0) {
			workOdysseyLevel = Math.floor((commenter.nCommentsOdyssey / commenter.nCommentsTotal) * 10);
		}

		if (commenter.nCommentsHymns > 0) {
			workHymnsLevel = Math.floor((commenter.nCommentsHymns / commenter.nCommentsTotal) * 10);
		}

		return (
			<div className={classes}>
				<div className="commenter-visualization-title">
					<h2>
						Comments
					</h2>
				</div>
				<div className="commenter-work-circles">
					{workIliadLevel ?
						<CommenterWorkCircle
							toggleVisibleWork={this.toggleVisibleWork}
							workTitle={'Iliad'}
							workSlug={'001'}
							workLevel={workIliadLevel}
							nComments={commenter.nCommentsIliad}
						/>
						: '' }
					{workOdysseyLevel ?
						<CommenterWorkCircle
							toggleVisibleWork={this.toggleVisibleWork}
							workTitle={'Odyssey'}
							workSlug={'odyssey'}
							workLevel={workOdysseyLevel}
							nComments={commenter.nCommentsOdyssey}
						/>
						: '' }
					{workHymnsLevel ?
						<CommenterWorkCircle
							toggleVisibleWork={this.toggleVisibleWork}
							workTitle={'Hymns'}
							workSlug={'homeric-hymns'}
							workLevel={workHymnsLevel}
							nComments={commenter.nCommentsHymns}
						/>
						: '' }
				</div>
				<div className="work-visualizations">
					{this.renderWorks()}
				</div>
			</div>
		);
	}
}


CommenterVisualizations.propTypes = {
	commenter: PropTypes.object.isRequired,
	isTest: PropTypes.bool,
};

CommenterVisualizations.childContextTypes = {
	muiTheme: PropTypes.object.isRequired
};


export default CommenterVisualizations;
