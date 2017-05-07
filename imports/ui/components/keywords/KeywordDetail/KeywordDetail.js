import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';

// api
import Comments from '/imports/api/collections/comments';
import Keywords from '/imports/api/collections/keywords';
import Settings from '/imports/api/collections/settings';

// components
import KeywordContext from '/imports/ui/components/keywords/KeywordContext';
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import KeywordCommentList from '/imports/ui/components/keywords/KeywordCommentList';
import CommentsRecent from '/imports/ui/components/commentary/comments/CommentsRecent';

// lib
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';


const KeywordDetail = React.createClass({

	propTypes: {
		slug: React.PropTypes.string.isRequired,
		keyword: React.PropTypes.object,
		settings: React.PropTypes.object,
		keywordComments: React.PropTypes.array,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			keywordReferenceModalVisible: false,
			referenceTop: 0,
			referenceLeft: 0,
			keyword: '',
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},

	deleteKeyword() {
		const { keyword } = this.props;
		Meteor.call('keywords.delete', keyword._id, (error, keywordId) => {
			if (error) {
				console.log(keywordId, error);
			} else {
				FlowRouter.go('/keywords');
			}
		});
	},

	_keywordDescriptionOnClick(e) {
		const $target = $(e.target);
		const upperOffset = 90;
		if ($target.hasClass('keyword-gloss')) {
			const keyword = $target.data().link.replace('/keywords/', '');
			this.setState({
				keywordReferenceModalVisible: true,
				referenceTop: $target.offset().top - upperOffset,
				referenceLeft: $target.offset().left + 160,
				keyword,
			});
		}
	},

	_closeKeywordReference() {
		this.setState({
			keywordReferenceModalVisible: false,
			referenceTop: 0,
			referenceLeft: 0,
			keyword: '',
		});
	},

	render() {
		const { keyword, settings, keywordComments } = this.props;

		if (!keyword) {
			return <div />;
		}

		Utils.setTitle(`${keyword.title} | ${settings.title}`);
		if (keyword.description) {
			Utils.setDescription(Utils.trunc(keyword.description, 150));
		}
		Utils.setMetaImage(`${location.origin}/images/apotheosis_homer.jpg`);

		return (
			<div className="page keywords-page keywords-detail-page">
				<div className="content primary">
					<section className="block header header-page cover parallax">
						<BackgroundImageHolder
							imgSrc="/images/apotheosis_homer.jpg"
						/>

						<div className="container v-align-transform">
							<div className="grid inner">
								<div className="center-content">
									<div className="page-title-wrap">
										<h2 className="page-title ">{keyword.title}</h2>
										{Roles.userIsInRole(Meteor.userId(), ['editor', 'admin', 'commenter']) ?
											<div>
												<RaisedButton
													href={`/keywords/${keyword.slug}/edit`}
													className="cover-link light"
													label="Edit"
												/>
												<RaisedButton
													onClick={this.deleteKeyword}
													className="cover-link light"
													label="Delete"
												/>
											</div>
										: ''}
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="page-content">
						{keyword.lineFrom ?
							<KeywordContext keyword={keyword} />
						: ''}
						{(
							keyword.description
							&& keyword.description.length
							&& keyword.description !== '<p></p>'
						) ?
							<div
								className="keyword-description"
								dangerouslySetInnerHTML={{ __html: keyword.description }}
								onClick={this._keywordDescriptionOnClick}
							/>
						: ''}

						<hr />

						<h1>Related comments</h1>

						<KeywordCommentList
							keywordComments={keywordComments}
						/>

					</section>

					<CommentsRecent />

					{this.state.keywordReferenceModalVisible ?
						<KeywordReferenceModal
							visible={this.state.keywordReferenceModalVisible}
							top={this.state.referenceTop}
							left={this.state.referenceLeft}
							keyword={this.state.keyword}
							close={this._closeKeywordReference}
						/>
					: ''}

				</div>
			</div>
		);
	},
});

const KeywordDetailContainer = createContainer(({ slug }) => {
	// SUBSCRIPTIONS:
	Meteor.subscribe('keywords.slug', slug, Session.get('tenantId'));
	const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));


	// FETCH DATA:
	const query = {
		slug,
	};
	const keyword = Keywords.findOne(query);

	let keywordComments = null;
	if (keyword) {
		const keywordCommentsQuery = { keywords: { $elemMatch: { _id: keyword._id } } };
		Meteor.subscribe('comments', keywordCommentsQuery);

		keywordComments = Comments.find(keywordCommentsQuery).fetch();
	}

	return {
		keyword,
		settings: settingsHandle.ready() ? Settings.findOne() : {},
		keywordComments,
	};
}, KeywordDetail);

export default KeywordDetailContainer;
