/*

filters – queryParams relations explanation:
“queryParams” represent state of truth
“filters” are a friendly object representation of “queryParams” passed to children components

To change the commentary filtering,
call the “this._updateRoute(filters)” method
with new “filters” object passed as first attribute.

*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { ApolloProvider, compose } from 'react-apollo';
import qs from 'qs-lite';
import Cookies from 'js-cookie';

// layouts:
import Commentary from '/imports/ui/layouts/commentary/Commentary';
import ModalLogin from '/imports/ui/layouts/auth/ModalLogin';
import configureStore from '/imports/store/configureStore';
import Header from '/imports/ui/layouts/header/Header';

// graphql
import { referenceWorksQuery } from '/imports/graphql/methods/referenceWorks';
import { worksQuery } from '/imports/graphql/methods/works';


// lib:
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';

// helpers:
import {
	createFilterFromQueryParams,
	createQueryParamsFromFilters,
	updateFilterOnChangeLineEvent,
	updateFilterOnChangeTextSearchEvent,
	updateFilterOnCKeyAndValueChangeEvent,
	createFilterFromURL
} from './helpers';

class CommentaryLayout extends Component {

	static propTypes = {
		queryParams: PropTypes.object,
		params: PropTypes.object,
		referenceWorks: PropTypes.array,
		works: PropTypes.array,
		isTest: PropTypes.bool,
		history: PropTypes.any
	};

	static childContextTypes = {
		muiTheme: PropTypes.object.isRequired,
	};

	static defaultProps = {
		queryParams: {
			lineTo: 611,
			work: 'iliad',
			subworks: '1'
		}
	};

	constructor(props) {
		super(props);

		this.state = {
			modalLoginLowered: false,
			skip: 0,
			limit: 10,
		};

		this.getChildContext = this.getChildContext.bind(this);
		this.getFilterValue = this.getFilterValue.bind(this);
		this._updateRoute = this._updateRoute.bind(this);
		this._toggleSearchTerm = this._toggleSearchTerm.bind(this);
		this._handleChangeTextsearch = this._handleChangeTextsearch.bind(this);
		this._handleChangeLineN = this._handleChangeLineN.bind(this);
		this.loadMoreComments = this.loadMoreComments.bind(this);
		this.showLoginModal = this.showLoginModal.bind(this);
		this.closeLoginModal = this.closeLoginModal.bind(this);
	}

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
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
		if (filters) {
			queryParams = createQueryParamsFromFilters(filters, this.props.referenceWorks);
		} else {
			queryParams = this.props.queryParams;
		}

		// update route
		const urlParams = qs.stringify(queryParams);

		this.props.history.push(`/commentary/?${urlParams}`);
	}

	_toggleSearchTerm(key, value) {
		const { queryParams } = this.props;

		const oldFilters = createFilterFromQueryParams(queryParams);

		// update filter based on the key and value
		const filters = updateFilterOnCKeyAndValueChangeEvent(oldFilters, key, value);

		this.setState({
			skip: 0,
			limit: 10,
		});

		this._updateRoute(filters);
	}

	_handleChangeTextsearch(e, textsearch) {
		const { queryParams } = this.props;
		const oldFilters = createFilterFromQueryParams(queryParams);

		// update filter based on the textsearch
		const filters = updateFilterOnChangeTextSearchEvent(oldFilters, e, textsearch);

		this._updateRoute(filters);
	}

	_handleChangeLineN(e) {
		const { queryParams } = this.props;
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

	render() {
		const { queryParams, params, works, referenceWorks } = this.props;
		const { skip, limit, modalLoginLowered } = this.state;

		// create filters object based on the queryParams or params
		const filters = createFilterFromURL(params, queryParams, works, referenceWorks);
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div>
					<div className="chs-layout commentary-layout">
						<Header
							filters={filters}
							toggleSearchTerm={this._toggleSearchTerm}
							handleChangeLineN={this._handleChangeLineN}
							handleChangeTextsearch={this._handleChangeTextsearch}
							isTest={this.props.isTest}
							initialSearchEnabled
						/>

						<Commentary
							filters={filters}
							toggleSearchTerm={this._toggleSearchTerm}
							showLoginModal={this.showLoginModal}
							loadMoreComments={this.loadMoreComments}
							history={this.props.history}
							skip={skip}
							tenantId={sessionStorage.getItem('tenantId')}
							limit={limit}
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

const cont = createContainer((props) => {

	const { match } = props;
	const tenantId = sessionStorage.getItem('tenantId');
	const properties = {
		tenantId: tenantId
	};
	const queryParams = qs.parse(window.location.search.substr(1));
	const params = match.params;

	if (tenantId) {
		props.referenceWorksQuery.refetch(properties);
	}


	const referenceWorks = props.referenceWorksQuery.loading ? [] : props.referenceWorksQuery.referenceWorks;
	const works = props.worksQuery.loading ? [] : props.worksQuery.works;

	return {
		params,
		queryParams,
		referenceWorks,
		works
	};
}, CommentaryLayout);
export default compose(
	referenceWorksQuery,
	worksQuery
)(cont);
