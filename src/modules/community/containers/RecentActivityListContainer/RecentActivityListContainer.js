import React from 'react';
import { compose } from 'react-apollo';


// component
import RecentActivityList from '../../components/RecentActivityList';

// graphql
import commentsRecent from '../../../comments/graphql/queries/commentsRecent';


const RecentActivityListContainer = props => {
	let comments = [];

	if (
		props.commentsRecent
    && props.commentsRecent.comments
	){
		comments = props.commentsRecent.comments;
	}

	return (
		<RecentActivityList
			comments={comments}
			loadMore={props.loadMore}
		/>
	)
};


export default compose(
	commentsRecent,
)(RecentActivityListContainer);
