/*

filters – queryParams relations explanation:
“queryParams” represent state of truth
“filters” are a friendly object representation of “queryParams” passed to children components

To change the commentary filtering,
call the “this._updateRoute(filters)” method
with new “filters” object passed as first attribute.

*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { compose } from 'react-apollo';
import qs from 'qs-lite';

// components
import CommentaryContainer from '../../containers/CommentaryContainer';
import ModalLogin from '../../../login/ModalLogin';
import Header from '../../../../components/header/Header';

// graphql
import { referenceWorksQuery } from '../../../../graphql/methods/referenceWorks';
import { editionsQuery } from '../../../../graphql/methods/editions';

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


class CommentaryLayout extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modalLoginLowered: false,
			skip: 0,
			limit: 10,
			queryParams: qs.parse(window.location.search.substr(1)),
			params: this.props.match,
			referenceWorks: [],
			works: []
		};

		this.props.referenceWorksQuery.refetch({
			tenantId: sessionStorage.getItem('tenantId')
		});


		this.getFilterValue = this.getFilterValue.bind(this);
		this._updateRoute = this._updateRoute.bind(this);
		this._toggleSearchTerm = this._toggleSearchTerm.bind(this);
		this._handleChangeTextsearch = this._handleChangeTextsearch.bind(this);
		this._handleChangeLineN = this._handleChangeLineN.bind(this);
		this.loadMoreComments = this.loadMoreComments.bind(this);
		this.showLoginModal = this.showLoginModal.bind(this);
		this.closeLoginModal = this.closeLoginModal.bind(this);
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
		console.log(queryParams);

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
		this.setState({
			limit: this.state.limit + 10,
		});
	}

	showLoginModal() {
		this.setState({
			modalLoginLowered: true,
		});
	}

	closeLoginModal() {
		this.setState({
			modalLoginLowered: false,
		});
	}
	componentWillReceiveProps(nextProps) {
		const referenceWorks = nextProps.referenceWorksQuery.loading ? [] : nextProps.referenceWorksQuery.referenceWorks;
		const works = nextProps.editionsQuery.loading ? [] : nextProps.editionsQuery.works
		this.setState({
			referenceWorks: referenceWorks,
			works: works,
			filters: createFilterFromURL(this.state.params, this.state.queryParams, this.state.works, this.state.referenceWorks)
		});
	}
	render() {
		const { skip, limit, modalLoginLowered, queryParams, filters } = this.state;
		const { isTest, history } =  this.props;
		// create filters object based on the queryParams or params
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div>
					<div className="chs-layout commentary-layout">
						<Header
							filters={this.state.filters}
							toggleSearchTerm={this._toggleSearchTerm}
							handleChangeLineN={this._handleChangeLineN}
							handleChangeTextsearch={this._handleChangeTextsearch}
							isTest={isTest}
							initialSearchEnabled
						/>

						<CommentaryContainer
							filters={filters}
							toggleSearchTerm={this._toggleSearchTerm}
							showLoginModal={this.showLoginModal}
							loadMoreComments={this.loadMoreComments}
							skip={skip}
							limit={limit}
							queryParams={queryParams}
						/>

					</div>
					{modalLoginLowered ?
						<ModalLogin
							lowered={modalLoginLowered}
							closeModal={this.closeLoginModal}
						/>
						: ''
					}
				</div>
			</MuiThemeProvider>
		);
	}
}
CommentaryLayout.defaultProps = {
	queryParams: {
		lineTo: 611,
		work: '001',
		subworks: '1'
	}
};
CommentaryLayout.propTypes = {
	queryParams: PropTypes.object,
	referenceWorks: PropTypes.array,
	works: PropTypes.array,
	isTest: PropTypes.bool,
	history: PropTypes.any,
	editionsQuery: PropTypes.object,
	referenceWorksQuery: PropTypes.object,
	match: PropTypes.object
};
export default compose(
	referenceWorksQuery,
	editionsQuery
)(CommentaryLayout);
