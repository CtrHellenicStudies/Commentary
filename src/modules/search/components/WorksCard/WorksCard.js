import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText } from 'material-ui/Card';

// components
import SearchTermButtonPanel from '../SearchTermButtonPanel';

// lib
import isActive from '../../lib/isActive';


const WorksCard = ({ works, styles, filters }) => (
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
					key={work.id}
					label={work.english_title}
					searchTermKey="works"
					value={work}
					active={isActive(work, 'works')}
				/>
			))}
		</CardText>
	</Card>
);

WorksCard.propTypes = {
	works: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.number.isRequired,
		english_title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
	})),
};

WorksCard.defaultProps = {
	works: [],
};

export default WorksCard;
