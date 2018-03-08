import React from 'react';
import { compose } from 'react-apollo';


import textSelectorQuery from '../../graphql/queries/textSelector';
import WorkSelector from '../../components/WorkSelector';


const WorkSelectorContainer = props => {
	let collection = null;
	let collections = [];

	if (
		props.textSelectorQuery
	) {
		if (
			props.textSelectorQuery.collection
		) {
			collection = props.textSelectorQuery.collection;
		}
		if (
			props.textSelectorQuery.collections
		) {
			collections = props.textSelectorQuery.collections;
		}
	}

	return (
		<WorkSelector
			collection={collection}
			collections={collections}
			collectionId={props.collectionId}
			textGroupUrn={props.textGroupUrn}
			workUrn={props.workUrn}
			handleSelectCollection={props.handleSelectCollection}
			handleSelectTextGroup={props.handleSelectTextGroup}
			handleSelectWork={props.handleSelectWork}
		/>
	);
}


export default compose(
	textSelectorQuery,
)(WorkSelectorContainer);
