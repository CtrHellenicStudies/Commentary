import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const LinePagination = React.createClass({
	propTypes: {
		linePagination: React.PropTypes.array.isRequired,
		linePaginationClicked: React.PropTypes.func.isRequired,
	},

	render() {
		const self = this;

		return (
			<div className="line-pagination">
				{this.props.linePagination.map((line, i) => (
					<RaisedButton
						key={i}
						label={line}
						className="line-page"
						onClick={self.props.linePaginationClicked.bind(null, line)}
					/>
				))}
			</div>

		);
	},
});


export default LinePagination;
