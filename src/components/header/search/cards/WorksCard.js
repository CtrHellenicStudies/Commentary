import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText } from 'material-ui/Card';

// components:
import SearchTermButtonPanel from '../SearchTermButtonPanel';

// helpers:
import { isActive } from './helpers';


/*
	BEGIN WorksCard
*/
const WorksCard = ({ works, toggleWorkSearchTerm, styles, filters }) => (
	<Card
		className="search-tool-card"
	>
		<CardHeader
			title="Work"
			style={styles.cardHeader}
			actAsExpander
			showExpandableButton
			className="card-header"
		/>
		<CardText expandable style={styles.wrapper}>
			{works.map(work => (
				<SearchTermButtonPanel
					key={work._id}
					toggleSearchTerm={toggleWorkSearchTerm}
					label={work.title}
					searchTermKey="works"
					value={work}
					active={isActive(filters, work, 'works')}
				/>
			))}
		</CardText>
	</Card>
);
WorksCard.propTypes = {
	works: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
	})),
	//...cardPropTypes,
};
WorksCard.defaultProps = {
	works: [],
	//...cardDefaultProps,
};
/*
	END WorksCard
*/

export default WorksCard;
