import React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

// graphql
import keywordDetailQuery from '../../graphql/queries/detail';
import settingsQuery from '../../../settings/graphql/queries/list';
import keywordRemoveMutation from '../../graphql/mutations/remove';
import commentsQuery from '../../../comments/graphql/queries/comments';

// components
import KeywordDetail from '../../components/KeywordDetail';
import LoadingPage from '../../../../components/loading/LoadingPage';
import NotFound from '../../../notFound/components/NotFound';


class KeywordDetailContainer extends React.Component {

	async deleteKeyword() {
		await this.props.keywordRemove(this.props.keywordDetailQuery.keyword._id);
		this.props.history.push('/words');
	}

	render() {
		const { tenantId, roles, keywordQuery, settingsQuery } = this.props;
		let keyword = null;
		let settings = {};
		let comments = [];


  	if (
  		keywordQuery && settingsQuery
  	) {
  		// loading state
  		if (keywordQuery.loading || settingsQuery.loading) {
  			return (
					<LoadingPage /> // eslint-disable-line
  			);
  		}

  		// keyword returned from database
  		if (keywordQuery.keyword && settingsQuery.settings) {
  			keyword = keywordQuery.keyword;
  			settings = settingsQuery.settings.find(x => x.tenantId === tenantId);
  		}
  	}

  	// if no keyword is found, render 404
  	if (!keyword || !settings) {
  		return (
				<NotFound /> // eslint-disable-line
  		);
  	}

		return (
			<KeywordDetail
				keyword={keyword}
				settings={settings}
				keywordComments={comments}
				roles={roles}
				deleteKeyword={this.deleteKeyword}
			/>
		);
	}
}

const mapStateToProps = state => ({
	roles: state.auth.roles,
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	keywordDetailQuery,
	settingsQuery,
	keywordRemoveMutation,
	commentsQuery
)(KeywordDetailContainer);
