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
import { login, register, logoutUser, verifyToken } from '../../../../lib/auth';

// graphql
import referenceWorksQuery from '../../../referenceWorks/graphql/queries/referenceWorksQuery';
import { editionsQuery } from '../../../textNodes/graphql/queries/editions';

// lib
import muiTheme from '../../../../lib/muiTheme';
import {
	createFilterFromQueryParams,
	createQueryParamsFromFilters,
	updateFilterOnChangeLineEvent,
	updateFilterOnChangeTextSearchEvent,
	updateFilterOnKeyAndValueChangeEvent,
	createFilterFromURL
} from '../../lib/queryFilterHelpers';

class CommentaryLayout extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			modalLoginLowered: false,
			skip: 0,
			limit: 10,
			queryParams: qs.parse(window.location.search.substr(1)),
			params: this.props.match,
			filters: []
		};

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
		let queryParams = {};
		const { referenceWorks, history } = this.props;
		if (filters) {
			queryParams = createQueryParamsFromFilters(filters, referenceWorks);
		} else {
			queryParams = this.props.queryParams;
		}

		// update route
		const urlParams = qs.stringify(queryParams);

		history.push(`/commentary/?${urlParams}`);
	}

	_toggleSearchTerm(key, value) {
		const { queryParams } = this.state;
		const oldFilters = createFilterFromQueryParams(queryParams);

		// update filter based on the key and value
		const filters = updateFilterOnKeyAndValueChangeEvent(oldFilters, key, value);

		this.setState({
			skip: 0,
			limit: 10,
		});

		this._updateRoute(filters);
	}

	_handleChangeTextsearch(e, textsearch) {
		const { queryParams } = this.state;
		const oldFilters = createFilterFromQueryParams(queryParams);

		// update filter based on the textsearch
		const filters = updateFilterOnChangeTextSearchEvent(oldFilters, e, textsearch);

		this._updateRoute(filters);
	}

	_handleChangeLineN(e) {
		const { queryParams } = this.state;
		const oldFilters = createFilterFromQueryParams(queryParams);

		// update filter based on the 'e' attribute
		const filters = updateFilterOnChangeLineEvent(oldFilters, e);

		this.setState({
			skip: 0,
			limit: 10,
		});
		this._updateRoute(filters);
	}

	loadMoreComments() {
		if (
			!this.props.isOnHomeView
			&& this.props.commentsMoreQuery
			&& this.props.commentsMoreQuery.commentsMore
		) {
			this.setState({
				limit: this.state.limit + 10,
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		const referenceWorks = nextProps.referenceWorksQuery.loading ? [] : nextProps.referenceWorksQuery.referenceWorks;
		const works = nextProps.editionsQuery.loading ? [] : nextProps.editionsQuery.works
		this.setState({
			referenceWorks: referenceWorks,
			works: works,
			filters: createFilterFromURL(this.state.params, this.state.queryParams, this.state.works, this.props.referenceWorks)
		});
	}

	render() {
		const { tenantId } = this.props;
		const { skip, limit, queryParams, filters } = this.state;

		// create filters object based on the queryParams or params
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div>
					<div className="chs-layout commentary-layout">
						<Header
							workFilters={this.state.filters}
							toggleSearchTerm={this._toggleSearchTerm}
							handleChangeLineN={this._handleChangeLineN}
							handleChangeTextsearch={this._handleChangeTextsearch}
							initialSearchEnabled
						/>

						<CommentaryContainer
							filters={filters}
							toggleSearchTerm={this._toggleSearchTerm}
							showLoginModal={this.showLoginModal}
							loadMoreComments={this.loadMoreComments}
							tenantId={tenantId}
							skip={skip}
							limit={limit}
							queryParams={queryParams}
						/>

					</div>
					<AuthModalContainer
						loginMethod={login}
						signupMethod={register}
						logoutMethod={logoutUser}
						getUserFromServer={verifyToken}
					/>
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
