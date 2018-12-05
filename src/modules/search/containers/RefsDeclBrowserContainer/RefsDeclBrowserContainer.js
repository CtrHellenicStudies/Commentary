import React from 'react';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router';
import qs from 'qs-lite';
import autoBind from 'react-autobind';

// component
import RefsDeclBrowser from '../../components/RefsDeclBrowser';

// graphql
import refsDeclsQuery from '../../graphql/queries/refsDecls';

// lib
import { parseValueUrn } from '../../../cts/lib/parseUrn';
import serializeUrn from '../../../cts/lib/serializeUrn';
import defaultWorksEditions from '../../../comments/lib/defaultWorksEditions';
import getCurrentSubdomain from '../../../../lib/getCurrentSubdomain';


class RefsDeclBrowserContainer extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleChangeTextLocation(newTextLocationRange) {
		console.log(newTextLocationRange);
		const queryParams = qs.parse(window.location.search.replace('?', ''));
		const subdomain = getCurrentSubdomain();
		let urn;
		let location = [];
		let works = [];
		let refsDecls = [];

		if (
			this.props.match
			&& this.props.match.params
			&& this.props.match.params.urn
		) {
			urn = this.props.match.params.urn;
		} else if (defaultWorksEditions[subdomain]) {
			urn = defaultWorksEditions[subdomain].defaultWorkUrn;
		}

		if (defaultWorksEditions[subdomain] && defaultWorksEditions[subdomain].works) {
			works = defaultWorksEditions[subdomain].works;
			works.forEach(work => {
				if (urn.indexOf(work.urn) === 0) {
					refsDecls = work.refsDecls;
				}
			});
		}

		const parsedUrn = parseValueUrn(urn);
		if (parsedUrn.passage && parsedUrn.passage.length) {
			location = parsedUrn.passage[0];
		} else {
			location = new Array(refsDecls.length).fill(1);
		}

		location[location.length - 1] = newTextLocationRange[0];
		parsedUrn.passage = [location];

		// update route
		const urlParams = qs.stringify(queryParams);
		this.props.history.push(`/commentary/${serializeUrn(parsedUrn)}/?${urlParams}`);
	}

	render() {
		const subdomain = getCurrentSubdomain();
		let urn;
		let works = [];
		let refsDecls = [];

		/**
		 * TODO: fix refsDecls query on works for textserver
		 *
		if (
			this.props.refsDeclsQuery
	    && this.props.refsDeclsQuery.works
		) {
			this.props.refsDeclsQuery.works.forEach(work => {
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
		if (
			this.props.match
			&& this.props.match.params
			&& this.props.match.params.urn
		) {
			urn = this.props.match.params.urn;
		} else if (defaultWorksEditions[subdomain]) {
			urn = defaultWorksEditions[subdomain].defaultWorkUrn;
		}

		if (defaultWorksEditions[subdomain] && defaultWorksEditions[subdomain].works) {
			works = defaultWorksEditions[subdomain].works;
			works.forEach(work => {
				if (urn.indexOf(work.urn) === 0) {
					refsDecls = work.refsDecls;
				}
			});
		}

		return (
			<RefsDeclBrowser
				searchDropdownOpen={this.props.searchDropdownOpen}
				toggleSearchDropdown={this.props.toggleSearchDropdown}
				handleChangeTextLocation={this.handleChangeTextLocation}
				refsDecls={refsDecls}
			/>
		);
	}
}

export default compose(
	refsDeclsQuery,
	withRouter,
)(RefsDeclBrowserContainer);
