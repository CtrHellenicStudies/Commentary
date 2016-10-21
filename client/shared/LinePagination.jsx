import RaisedButton from 'material-ui/RaisedButton';

LinePagination = React.createClass({
	propTypes: {
		linePagination: React.PropTypes.array.isRequired,
		linePaginationClicked: React.PropTypes.func.isRequired,
	},

	render() {
		const self = this;

		return (
			<div className="line-pagination">
				{this.props.linePagination.map(function(line, i){
					return (
						<RaisedButton
								key={i}
								label={line}
								className="line-page"
								onClick={self.props.linePaginationClicked.bind(null, line)}
						/>
						);
				})}
			</div>

		);

	}
});
