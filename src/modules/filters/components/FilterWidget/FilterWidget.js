import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { compose } from 'react-apollo';
import _s from 'underscore.string';

// lib
import toggleSearchTerm from '../../../search/lib/toggleSearchTerm';

// graphql
import commentersQuery from '../../../commenters/graphql/queries/list';

// styles
const styles = {
	iconStyle: {
		fontSize: 18,
		color: '#666',
	},
};


const FilterWidget = () => {
	const filters = [];

	return (
		<div className="filters">
			{filters.map((filter, i) => {
				if (['lineFrom', 'lineTo'].indexOf(filter.key) >= 0) {
					return null;
				}

				return (
					<div
						key={i}
						className="filter "
					>
						<span className="filter-key paper-shadow">{filter.key}</span>
						{filter.values.map((val, j) => {
							// commenters query through URL fix:
							if (filter.key === 'commenters' && !val.name && val.wordpressId) {
								const foundCommenter = commentersQuery.loading ? {} :commentersQuery.commenters.find(x => x.wordpressId === val.wordpressId);
								if (foundCommenter) {
									filters[i][j].name = foundCommenter.name;
								}
							}
							return (
								<RaisedButton
									key={j}
									labelPosition="before"
									className="filter-val "
									label={_s.truncate((val.title || val.name || val.slug || val.toString()).replace('-', ' '), 30)}
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
				);
			})}

		</div>
	);
};

export default compose(commentersQuery)(FilterWidget);
