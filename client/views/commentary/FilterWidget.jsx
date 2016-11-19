import RaisedButton from 'material-ui/RaisedButton';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

FilterWidget = React.createClass({

	propTypes: {
		filters: React.PropTypes.array.isRequired,
		toggleSearchTerm: React.PropTypes.func,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},


	render() {
		return (

			<div className="filters">
				{this.props.filters.map((filter, i) => ((['lineFrom', 'lineTo'].indexOf(filter.key) < 0) ?
					<div
						key={i}
						className="filter "
					>
						<span className="filter-key paper-shadow">{filter.key}</span>
						{filter.values.map((val, j) => {
							// commenters query through URL fix:
							if (filter.key === 'commenters' && !val.name && val.wordpressId) {
								const foundCommenter = Commenters.findOne({ wordpressId: val.wordpressId });
								if (foundCommenter) {
									filters[i][j].name = foundCommenter.name;
								}
							}
							return (<RaisedButton
								key={j}
								labelPosition="before"
								className="filter-val "
								label={val.title || val.name || val.slug || val.toString()}
								onClick={this.props.toggleSearchTerm.bind(null, filter.key, val)}
							>
								<i className="mdi mdi-close" />
							</RaisedButton>);
						})}
					</div>
					: ''
				))}

			</div>


		);
	},

});
