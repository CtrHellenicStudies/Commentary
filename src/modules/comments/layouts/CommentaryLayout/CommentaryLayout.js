/*

CommentaryLayout

filters – queryParams relations explanation:
“queryParams” represent state of truth
“filters” are a friendly object representation of “queryParams” passed to children components

To change the commentary filtering,
call the “this._updateRoute(filters)” method
with new “filters” object passed as first attribute.

*/

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { compose } from 'react-apollo';
import qs from 'qs-lite';

// components
import CommentaryContainer from '../../containers/CommentaryContainer';
import Header from '../../../../components/navigation/Header';

// auth
import AuthModalContainer from '../../../../modules/auth/containers/AuthModalContainer';

// graphql
import referenceWorksQuery from '../../../referenceWorks/graphql/queries/referenceWorksQuery';
import { editionsQuery } from '../../../textNodes/graphql/queries/editions';

// lib
import muiTheme from '../../../../lib/muiTheme';
import {
	createFiltersFromQueryParams,
	createQueryParamsFromFilters,
	updateFilterOnBrowseEvent,
	updateFilterOnChangeTextSearchEvent,
} from '../../lib/queryFilterHelpers';


class CommentaryLayout extends React.Component {
	constructor(props) {
		super(props);


		autoBind(this);
	}

	getFilterValue(filters, key) {
		let value = {};
		if (filters) {
			const filterKey = filters.find(filter => filter.key === key);
			if (filterKey) {
				value = filterKey.values[0];
			}
		}
		return value;
	}

	_updateRoute(filters) {
		let queryParams;
		if (filters) {
			queryParams = createQueryParamsFromFilters(filters);
		} else {
			queryParams = qs.parse(window.location.search.substr(1));
		}

		// update route
		const urlParams = qs.stringify(queryParams);
		this.props.history.push(`/commentary/?${urlParams}`);
	}

	_handleChangeTextsearch(e, textsearch) {
		const queryParams = qs.parse(window.location.search.substr(1));
		const oldFilters = createFiltersFromQueryParams(queryParams);

		// update filter based on the textsearch
		const filters = updateFilterOnChangeTextSearchEvent(oldFilters, e, textsearch);

		this._updateRoute(filters);
	}

	_handleBrowse(e) {
		const queryParams = qs.parse(window.location.search.substr(1));
		const oldFilters = createFiltersFromQueryParams(queryParams);

		// update filter based on the 'e' attribute
		const filters = updateFilterOnBrowseEvent(oldFilters, e);

		this._updateRoute(filters);
	}

	render() {
		const { tenantId } = this.props;
		const limit = 10;
		let skip = 0;
		const routeQueryParams = qs.parse(window.location.search);
		if (routeQueryParams.page) {
			skip = routeQueryParams.page * limit;
		}

		// create filters object based on the queryParams or params
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div>
					<div className="chs-layout commentary-layout">
						<Header
							handleBrowse={this._handleBrowse}
							handleChangeTextsearch={this._handleChangeTextsearch}
							initialSearchEnabled
						/>

						<CommentaryContainer
							tenantId={tenantId}
							skip={skip}
							limit={limit}
						/>

					</div>
					<AuthModalContainer />
				</div>
			</MuiThemeProvider>
		);
	}
}

CommentaryLayout.defaultProps = {
	queryParams: {},
};

CommentaryLayout.propTypes = {
	queryParams: PropTypes.object,
	referenceWorks: PropTypes.array,
	works: PropTypes.array,
	history: PropTypes.any,
	editionsQuery: PropTypes.object,
	referenceWorksQuery: PropTypes.object,
	match: PropTypes.object
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	referenceWorksQuery,
	editionsQuery,
	connect(mapStateToProps),
)(CommentaryLayout);
