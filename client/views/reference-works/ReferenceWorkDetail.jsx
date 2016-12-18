
import AvatarIcon from '/imports/avatar/client/ui/AvatarIcon.jsx';

ReferenceWorkDetail = React.createClass({

	propTypes: {
		slug: React.PropTypes.string.isRequired,
	},

	mixins: [ReactMeteorData],

	getMeteorData() {
		// SUBSCRIPTIONS:
		Meteor.subscribe('referenceWorks.slug', this.props.slug);
		Meteor.subscribe('commenters');

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
		};
	},

	createMarkup() {
		let __html = '';
		if (this.data.referenceWork) {
			__html += '<p>'
			__html += this.data.referenceWork.description.replace('\n', '</p><p>');
			__html += '</p>'
		}
		return {
			__html,
		};
	},

	render() {
		const referenceWork = this.data.referenceWork;
		const commenters = this.data.commenters;
		const commentersNames = [];
		commenters.forEach((commenter) => {
			commentersNames.push(commenter.name);
		});

		if (!referenceWork) {
			return <div />;
		}

		return (
			<div className="page reference-works-page reference-works-detail-page">
				<div className="content primary">
					<section className="block header header-page cover parallax">
						<div className="background-image-holder blur-2--no-remove remove-blur blur-10">
							<img
								className="background-image"
								src="/images/apotheosis_homer.jpg"
								role="presentation"
							/>
						</div>
						<div className="block-screen brown" />

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
							<div className="reference-work-byline">
								<h3>By {commenters.map((commenter, i) => {
									let ending = '';

									if (i < commenters.length - 2) {
										ending = ', ';
									} else if (i < commenters.length - 1) {
										ending = ' and ';
									}

									return (
										<span>
											<a
												href={`/commenters/${commenter.slug}`}
												key={i}
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
