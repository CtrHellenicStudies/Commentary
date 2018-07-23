import React from 'react';
import { compose } from 'react-apollo';

// component
import LocationBrowser from '../../components/LocationBrowser';

// graphql
import refsDeclsQuery from '../../graphql/queries/refsDecls';

// lib
import defaultWorksEditions from '../../../comments/lib/defaultWorksEditions';
import getCurrentSubdomain from '../../../../lib/getCurrentSubdomain';


const LocationBrowserContainer = props => {
	const subdomain = getCurrentSubdomain();
	let location = [1, 1];
	let works = [];
	let refsDecls = [];

	/**
	 * TODO: fix refsDecls query on works for textserver
	 *
	if (
		props.refsDeclsQuery
    && props.refsDeclsQuery.works
	) {
		props.refsDeclsQuery.works.forEach(work => {
			if (
				work.refsDecls
        && work.refsDecls.length
			) {
				refsDecls = work.refsDecls;
			}
		});
	}
	*/

	// TODO move static works list for tenant to db with admin settings page
	if (defaultWorksEditions[subdomain] && defaultWorksEditions[subdomain].works) {
		works = defaultWorksEditions[subdomain].works;
		works.forEach(work => {
			if (work.urn === props.urn) {
				refsDecls = work.refsDecls;
			}
		});
	}

	return (
		<LocationBrowser
			location={location}
			refsDecls={refsDecls}
		/>
	);
};

export default compose(
	refsDeclsQuery,
)(LocationBrowserContainer);
