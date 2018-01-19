import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

import Utils from '/imports/lib/utils';

/*
	helpers
*/
const styles = {
	iconStyle: {
		fontSize: 18,
		color: '#666',
	},
};

const getLabel = val => {
	let label = '';

	if (!val) {
		return label;
	}

	if (val.title) {
		label = val.title;
	} else if (val.name) {
		label = val.name;
	} else if (val.slug) {
		label = val.slug;
	} else if (val.n) {
		label = val.n.toString();
	} else {
		label = val.toString();
	}

	label = label.replace('-', ' ');

	return Utils.trunc(label, 30);
};

const FilterWidget = ({ filters, toggleSearchTerm }) => (
	<div className="filters">
		{filters.map((filter, i) => ((['lineFrom', 'lineTo'].indexOf(filter.key) < 0) ?
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
					return (
						<RaisedButton
							key={j}
							labelPosition="before"
							className="filter-val "
							label={getLabel(val)}
							onClick={toggleSearchTerm.bind(null, filter.key, val)}
							icon={
								<FontIcon
									className="mdi mdi-close mdi-18px"
									style={styles.iconStyle}
								/>
							}
						/>
					);
				})}
			</div>
			: ''
		))}

	</div>
);
FilterWidget.propTypes = {
	filters: PropTypes.array.isRequired,
	toggleSearchTerm: PropTypes.func.isRequired,
};

export default FilterWidget;
