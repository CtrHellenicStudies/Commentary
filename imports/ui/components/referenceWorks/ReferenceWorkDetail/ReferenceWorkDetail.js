import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import AvatarIcon from '/imports/ui/components/avatar/AvatarIcon';
import Commenters from '/imports/api/collections/commenters';
import ReferenceWorks from '/imports/api/collections/referenceWorks';
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';

const ReferenceWorkDetail = React.createClass({

	propTypes: {
		slug: React.PropTypes.string.isRequired,
	},

	mixins: [ReactMeteorData],

	getMeteorData() {
		// SUBSCRIPTIONS:
		Meteor.subscribe('referenceWorks.slug', this.props.slug, Session.get('tenantId'));
		Meteor.subscribe('commenters', Session.get('tenantId'));
		const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

		// FETCH DATA:
		const query = {
			slug: this.props.slug,
		};
		const referenceWork = ReferenceWorks.findOne(query);

		let commenters = [];
		if (referenceWork && 'authors' in referenceWork) {
			commenters = Commenters.find({
				_id: { $in: referenceWork.authors },
			}, { sort: { name: 1 } }).fetch();
		}

		return {
			referenceWork,
			commenters,
			settings: settingsHandle.ready() ? Settings.findOne() : { title: '' },
		};
	},

	createMarkup() {
		let __html = '';
		if (this.data.referenceWork) {
			__html += '<p>';
			__html += this.data.referenceWork.description.replace('\n', '</p><p>');
			__html += '</p>';
		}
		return {
			__html,
		};
	},

	render() {
		const { referenceWork, commenters, settings } = this.data;
		const commentersNames = [];
		commenters.forEach((commenter) => {
			commentersNames.push(commenter.name);
		});

		if (!referenceWork) {
			return <div />;
		}

		Utils.setTitle(`${referenceWork.title} ${commenters.join(', ')} | ${settings.title}`);
		Utils.setDescription(Utils.trunc(referenceWork.description, 150));
		Utils.setMetaImage(`${location.origin}/images/apotheosis_homer.jpg`);

		return (
			<div className="page reference-works-page reference-works-detail-page">
				<div className="content primary">
					<section className="block header header-page cover parallax">
						<BackgroundImageHolder
							imgSrc="/images/apotheosis_homer.jpg"
						/>

						<div className="container v-align-transform">
							<div className="grid inner">
								<div className="center-content">
									<div className="page-title-wrap">
										<h2 className="page-title ">{referenceWork.title}</h2>
										{referenceWork.link ?
											<a
												className="read-online-link"
												href={referenceWork.link}
											>
												Read Online <i className="mdi mdi-open-in-new" />
											</a>
										: ''}
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="page-content">

						{commenters && commenters.length ?
							<div className="page-byline">
								<h3>By {commenters.map((commenter, i) => {
									let ending = '';

									if (i < commenters.length - 2) {
										ending = ', ';
									} else if (i < commenters.length - 1) {
										ending = ' and ';
									}

									return (
										<span
											key={i}
										>
											<a
												href={`/commenters/${commenter.slug}`}
											>
												{commenter.name}
											</a>{ending}
										</span>
									);
								})}
								</h3>
							</div>
						: ''}

						<div
							dangerouslySetInnerHTML={this.createMarkup()}
						/>
					</section>

					<CommentsRecent />
				</div>
			</div>
		);
	},

});

export default ReferenceWorkDetail;
