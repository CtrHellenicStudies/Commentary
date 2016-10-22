
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

CommenterVisualizations = React.createClass({

	propTypes: {
		commenter: React.PropTypes.object.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			visibleWork: '',
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},


	getMeteorData() {
		const query = {};

		return {
			works: Works.find(query, { sort: { order: 1 } }).fetch(),
		};
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
		if (this.data.works.length) {
			return this.data.works.map((work, i) =>
				<CommenterWorkVisualization
					key={i}
					toggleVisibleWork={this.toggleVisibleWork}
					work={work}
				/>
			);
		}

		return '';
	},

	render() {
		let classes = 'commenter-visualizations';
		if (this.state.visibleWork.length) {
			classes += ` commenter-visualizations-${this.state.visibleWork}-visible`;
		}

		return (
			<div className={classes}>
				<div className="commenter-work-circles">
					<CommenterWorkCircle
						toggleVisibleWork={this.toggleVisibleWork}
						workTitle={"Iliad"}
						workSlug={"iliad"}
						workLevel={10}
					/>
					<CommenterWorkCircle
						toggleVisibleWork={this.toggleVisibleWork}
						workTitle={"Odyssey"}
						workSlug={"odyssey"}
						workLevel={10}
					/>
					<CommenterWorkCircle
						toggleVisibleWork={this.toggleVisibleWork}
						workTitle={"Hymns"}
						workSlug={"homeric-hymns"}
						workLevel={10}
					/>
				</div>
				<div className="work-visualizations">
					{this.renderWorks()}
				</div>
			</div>
		);
	},
});
