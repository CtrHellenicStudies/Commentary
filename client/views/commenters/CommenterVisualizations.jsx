
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

CommenterVisualizations = React.createClass({

	propTypes: {
		commenter: React.PropTypes.object.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			visibleWork: '',
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

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
	},

	renderWorks() {
		return this.props.commenter.nCommentsWorks.map((work, i) =>
			<CommenterWorkVisualization
				key={i}
				toggleVisibleWork={this.toggleVisibleWork}
				work={work}
			/>
		);
	},

	render() {
		const commenter = this.props.commenter;
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
		console.log(workIliadLevel);

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
							workTitle={"Iliad"}
							workSlug={"iliad"}
							workLevel={workIliadLevel}
						/>
					: '' }
					{workOdysseyLevel ?
						<CommenterWorkCircle
							toggleVisibleWork={this.toggleVisibleWork}
							workTitle={"Odyssey"}
							workSlug={"odyssey"}
							workLevel={workOdysseyLevel}
						/>
					: '' }
					{workHymnsLevel ?
						<CommenterWorkCircle
							toggleVisibleWork={this.toggleVisibleWork}
							workTitle={"Hymns"}
							workSlug={"homeric-hymns"}
							workLevel={workHymnsLevel}
						/>
					: '' }
				</div>
				<div className="work-visualizations">
					{this.renderWorks()}
				</div>
			</div>
		);
	},
});
