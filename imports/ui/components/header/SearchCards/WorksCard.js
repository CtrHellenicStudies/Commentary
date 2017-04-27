import { Card, CardHeader, CardText } from 'material-ui/Card';

// components:
import SearchTermButtonPanel from '/imports/ui/components/header/SearchTermButtonPanel'; // eslint-disable-line import/no-absolute-path

// helpers:
import { isActive, cardPropTypes, cardDefaultProps } from './helpers';


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
	works: React.PropTypes.arrayOf(React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
		slug: React.PropTypes.string.isRequired,
	})),
	...cardPropTypes,
};
WorksCard.defaultProps = {
	works: [],
	...cardDefaultProps,
};
/*
	END WorksCard
*/

export default WorksCard;
