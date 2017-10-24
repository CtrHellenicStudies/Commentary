import React from 'react';
import PropTypes from 'prop-types';
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
	linePagination: PropTypes.arrayOf(PropTypes.number).isRequired,
	linePaginationClicked: PropTypes.func.isRequired,
};

export default LinePagination;
