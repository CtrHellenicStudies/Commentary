import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const LinePagination = ({ linePagination, linePaginationClicked }) => (
	<div className="line-pagination">
		{linePagination.map((line, i) => (
			<RaisedButton
				key={line}
				label={line}
				className="line-page"
				onClick={linePaginationClicked.bind(null, line)}
			/>
		))}
	</div>
);
LinePagination.propTypes = {
	linePagination: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
	linePaginationClicked: React.PropTypes.func.isRequired,
};

export default LinePagination;
