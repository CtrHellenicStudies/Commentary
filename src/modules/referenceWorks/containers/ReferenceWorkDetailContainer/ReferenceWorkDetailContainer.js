import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import _s from 'underscore.string';

// component
import ReferenceWorkDetail from '../../components/ReferenceWorkDetail';
import LoadingPage from '../../../../components/loading/LoadingPage';

// graphql
import commentersQuery from '../../../commenters/graphql/queries/list';
import referenceWorksQuery from '../../graphql/queries/list';
import settingsQuery from '../../../settings/graphql/queries/list';

// lib
import PageMeta from '../../../../lib/pageMeta';


const ReferenceWorkDetailContainer = props => {
	const { tenantId } = props;
	const slug = props.match.params.slug;
	let settings = { title: '' };
	let referenceWork = null;
	let tenantCommenters = [];
	let commenters = [];
	const commentersNames = [];
	let commentersTitle = '';

	if (
		props.settingsQuery
    && props.settingsQuery.settings
	) {
		settings = props.settingsQuery.settings.find(x => x.tenantId === tenantId);
	}

	if (
		props.referenceWorksQuery
    && props.referenceWorksQuery.referenceWorks
	) {

  	referenceWork = props.referenceWorksQuery.referenceWorks.find(x => x.slug === slug && x.tenantId === tenantId);
	}
	if (
		props.commentersQuery
    && props.commentersQuery.commenters
	) {
  	tenantCommenters = props.commentersQuery.commenters.filter(x => x.tenantId === tenantId);
	}


	if (referenceWork && referenceWork.authors) {
		referenceWork.authors.forEach(authorId => {
			tenantCommenters.forEach(commenter => {
				if (commenter._id === authorId) {
					commenters.push(commenter);
				}
			});
		});

  	commenters.sort((a, b) => { return a > b; });

		commenters.forEach((commenter) => {
			commentersNames.push(commenter.name);
		});
		commentersTitle = commentersNames.join(', ');
	}

	if (!referenceWork || !settings) {
		// TODO: Handle not found
		return <LoadingPage />;
	}

	PageMeta.setTitle(`${referenceWork.title} ${commentersTitle} | ${settings.title}`);
	PageMeta.setDescription(_s.truncate(referenceWork.description, 150));
	PageMeta.setMetaImage(`${window.location.origin}/images/apotheosis_homer.jpg`);


	return (
		<ReferenceWorkDetail
			referenceWork={referenceWork}
			settings={settings}
			commenters={commenters}
		/>
	);
}

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	commentersQuery,
	referenceWorksQuery,
	settingsQuery
)(ReferenceWorkDetailContainer);
