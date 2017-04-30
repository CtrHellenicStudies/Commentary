import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import Comments from '/imports/api/collections/comments';
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';

// lib
import Utils from '/imports/lib/utils';

// components:
import CommentersList from '/imports/ui/components/commenters/CommentersList';
import WorksList from '/imports/ui/components/works/WorksList';
import KeywordsList from '/imports/ui/components/keywords/KeywordsList';
import Spinner from '/imports/ui/components/loading/Spinner';

// layouts:
import Commentary from '/imports/ui/layouts/commentary/Commentary';


const Home = React.createClass({

	propTypes: {
		settings: React.PropTypes.object,
		comments: React.PropTypes.array,
		ready: React.PropTypes.bool,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	componentDidMount() {
		new WOW().init();
	},

	scrollToIntro(e) {
		$('html, body').animate({ scrollTop: $('#intro').offset().top - 100 }, 300);

		e.preventDefault();
	},

	render() {
		const { settings, comments, ready } = this.props;
		let imageUrl = `${location.origin}/images/hector.jpg`;
		let introImage = '/images/ajax_achilles_3.jpg';
		let introImageCaption = '';

		if (!settings) {
			return <Loading />
		}

		if (
			settings.homepageCover
			&& settings.homepageCover.length
		) {
			imageUrl = settings.homepageCover;
		}

		if (
			settings.homepageIntroductionImage
			&& settings.homepageIntroductionImage.length
		) {
			introImage = settings.homepageIntroductionImage;
		}

		if (
			settings.homepageIntroductionImageCaption
			&& settings.homepageIntroductionImageCaption.length
		) {
			introImageCaption = settings.homepageIntroductionImageCaption;
		}

		Utils.setTitle(`Home | ${settings ? settings.title : ''}`);
		Utils.setDescription((settings ? settings.subtitle : ''));
		Utils.setMetaImage(imageUrl);

		return (
			<div className="home">

				<div className="content primary">

					<section className="header cover fullscreen parallax">
						<BackgroundImageHolder
							imgSrc={imageUrl}
						/>

						<div
							className="container v-align-transform wow fadeIn"
							data-wow-duration="1s"
							data-wow-delay="0.1s"
						>

							<div className="grid inner">
								<div className="center-content">

									<div className="site-title-wrap">
										<h2 className="site-title">{settings.name}</h2>
										<h3 className="site-subtitle">
											{settings.subtitle}
										</h3>
									</div>

									<RaisedButton
										href="#intro"
										className="cover-link learn-more"
										label="Learn More"
										onClick={this.scrollToIntro}
									/>

									<RaisedButton
										href="/commentary/"
										className="cover-link go-to-commentary"
										label="Go to Commentary"
									/>


								</div>
							</div>
						</div>

						<div className="scroll-down-helper">
							<p>
								<em>Scroll down for an overview of the project.</em>
							</p>
							<i className="mdi mdi-chevron-down" />
						</div>

					</section>

					<section id="intro" className="intro">
						<div className="container">
							<div className="row">
								<h2>
									{settings.homepageIntroductionTitle}
								</h2>

								<div className="intro-col intro-col-text">
									{settings.introBlocks.map((block, i) => (
										<div
											key={i}
											className="mb40 mb-xs-24l intro-block-text"
										>
											<h5 className="uppercase intro-block-header">
												{block.title}
											</h5>
											<span className="intro-block-desc">
												{block.text}
											</span>
											{block.linkURL && block.linkText ?
												<div
													style={{ marginTop: '20px' }}
												>
													<RaisedButton
														className="intro-block-link cover-link dark"
														href={block.linkURL}
														label={block.linkText}
													/>
												</div>
											: ''}
										</div>
									))}
								</div>
								<div className="intro-col intro-col-image image-wrap wow fadeIn">
									<img
										className="paper-shadow"
										alt={introImageCaption}
										src={introImage}
									/>
									<div
										className="caption"
										dangerouslySetInnerHTML={{
											__html: introImageCaption
										}}
									/>
								</div>
							</div>
							{/* <!--end of row-->*/}
						</div>
						{/* <!--end of container-->*/}
					</section>

					<section className="commentors">
						<BackgroundImageHolder
							imgSrc="/images/school-athens.jpg"
						/>

						<div className="container">
							<h2 className="block-title">Commentators</h2>
							<CommentersList
								featureOnHomepage
								defaultAvatarUrl='/images/default_user.jpg'
								limit={3}
							/>
							<RaisedButton
								href="/commenters"
								className="cover-link light show-more "
								label="Other Commentators"
							/>
						</div>
					</section>
					<section id="visualizations" className="browse-commentary block-shadow">
						<span className="visualizations-coaching-text">
							The charts below visualize data about the number of comments per book or hymn,
							but they are also an interface into the commentary itself.
							The darker the shade of the bar, the more comments there are,
							but try clicking on the shaded elements and see what happens.
						</span>
						<div className="container data-visualization-container">
							<WorksList />
						</div>
					</section>

					<section className="keywords">
						<div className="grid inner">
							<h2 className="keyword-divider-title">Keywords</h2>
							<div className="underline" />
							<KeywordsList type="word" title="Keywords" limit={5} />
							<RaisedButton
								href="/keywords"
								className="cover-link show-more primary "
								label="More Keywords"
							/>
						</div>
					</section>

					<section className="keywords keyideas">
						<div className="grid inner">
							<h2 className="keyword-divider-title">Key Ideas</h2>
							<div className="underline" />
							<KeywordsList type="idea" title="Key Ideas" limit={5} />
							<RaisedButton
								href="/keyideas"
								className="cover-link show-more primary "
								label="More Key Ideas"
							/>
						</div>
					</section>

					<section className="get-started">
						<h2 className="block-title">Get Started</h2>
						<div className="get-started-comments">
							{ready ?
								<Commentary
									isOnHomeView
									filters={[]}
									comments={comments}
									skip={0}
									limit={10}
								/>
								:
									<Spinner />
							}
							<div className="read-more-link">

								<RaisedButton
									href="/commentary"
									className="cover-link light show-more "
									label="Read More"
								/>

							</div>
						</div>
					</section>
				</div>
			</div>
		);
	},
});

export default createContainer(() => {
	const query = { tenantId: Session.get('tenantId') };
	const commentsSub = Meteor.subscribe('comments', query, 0, 10);

	const comments = Comments.find({}, { sort: { 'work.order': 1, 'subwork.n': 1, lineFrom: 1, nLines: -1 } }).fetch();

	return {
		comments,
		ready: commentsSub.ready(),
	};
}, Home);
