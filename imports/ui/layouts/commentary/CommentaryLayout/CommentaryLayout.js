/*

filters – queryParams relations explanation:
“queryParams” represent state of truth
“filters” are a friendly object representation of “queryParams” passed to children components

To change the commentary filtering,
call the “this._updateRoute(filters)” method
with new “filters” object passed as first attribute.

*/
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// layouts:
import Commentary from '/imports/ui/layouts/commentary/Commentary';
import ModalLogin from '/imports/ui/layouts/auth/ModalLogin';
import Header from '/imports/ui/layouts/header/Header';

// api
import Works from '/imports/api/collections/works';
import ReferenceWorks from '/imports/api/collections/referenceWorks';

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


class CommentaryLayout extends React.Component {

	static propTypes = {
		queryParams: React.PropTypes.object,
		params: React.PropTypes.object,
		referenceWorks: React.PropTypes.array,
		works: React.PropTypes.array,
		isTest: React.PropTypes.bool,
	};

	static childContextTypes = {
		muiTheme: React.PropTypes.object.isRequired,
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
			queryParams = createQueryParamsFromFilters(filters);
		} else {
			queryParams = this.props.queryParams;
		}

		// update route
		FlowRouter.go('/commentary/', {}, queryParams);
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
		const { queryParams, params, works } = this.props;
		const { skip, limit, modalLoginLowered } = this.state;

		// create filters object based on the queryParams or params
		const filters = createFilterFromURL(params, queryParams, works);

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
							skip={skip}
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

export default createContainer(() => {
	const handle = Meteor.subscribe('referenceWorks.all', Session.get('tenantId'));
	const handleWorks = Meteor.subscribe('works', Session.get('tenantId'));

	const referenceWorks = ReferenceWorks.find().fetch();
	const works = Works.find().fetch();

	return {
		referenceWorks,
		works,
	};
}, CommentaryLayout);
