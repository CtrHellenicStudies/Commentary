import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import Comments from '/imports/collections/comments';

HomeView = React.createClass({

	propTypes: {
		settings: React.PropTypes.object,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},


	mixins: [ReactMeteorData],

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	componentDidMount() {
		new WOW().init();
	},

	getMeteorData() {
		// SUBSCRIPTIONS:
		const query = { tenantId: Session.get('tenantId') };
		const commentsSub = Meteor.subscribe('comments', query, 0, 10);

		const comments = Comments.find({}, { sort: { 'work.order': 1, 'subwork.n': 1, lineFrom: 1, nLines: -1 } }).fetch();

		const commentsReady = commentsSub.ready();

		return {
			comments,
			commentsReady,
		};
	},
	scrollToIntro(e) {
		$('html, body').animate({ scrollTop: $('#intro').offset().top - 100 }, 300);

		e.preventDefault();
	},

	render() {
		const { settings } = this.props;
		let imageUrl = `${location.origin}/images/hector.jpg`;
		let introImage = '/images/ajax_achilles_3.jpg';
		let introImageCaption = '';
		let introLinkText = '   ';
		let introLink = '#';


		if (settings) {
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

			if (
				settings.homepageIntroductionLinkText
				&& settings.homepageIntroductionLinkText.length
			) {
				introLinkText = settings.homepageIntroductionLinkText;
			}
			if (
				settings.homepageIntroductionLink
				&& settings.homepageIntroductionLink.length
			) {
				introLink = settings.homepageIntroductionLink;
			}
		}

		Utils.setTitle(`Home | ${settings ? settings.title : ''}`);
		Utils.setDescription((settings ? settings.subtitle : ''));
		Utils.setMetaImage(imageUrl);

		return (
			<div className="home">

				<div className="content primary">

					<section className="header cover fullscreen parallax">
						<div className="background-image-holder remove-blur blur-10">
							<img className="background-image" src={imageUrl} role="presentation" />
						</div>
						<div className="block-screen brown" />

						<div
							className="container v-align-transform wow fadeIn"
							data-wow-duration="1s"
							data-wow-delay="0.1s"
						>

							<div className="grid inner">
								<div className="center-content">

									<div className="site-title-wrap">
										<h2 className="site-title">{this.props.settings ? this.props.settings.name : undefined}</h2>
										<h3 className="site-subtitle">
											{this.props.settings ? this.props.settings.subtitle : undefined}
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
									<div
										className="mb40 mb-xs-24l intro-block-text "
										dangerouslySetInnerHTML={{
											__html: settings.homepageIntroductionText,
										}}
									/>

									<RaisedButton
										className="cover-link dark"
										href={introLink}
										label={introLinkText}
									/>

								</div>
								<div className="intro-col intro-col-image image-wrap wow fadeIn">
									<img
										className="paper-shadow"
										alt={introImageCaption}
										src={introImage}
									/>
									<div className="caption">
										<span
											className="caption-text"
											dangerouslySetInnerHTML={{
												__html: introImageCaption
											}}
										/>
									</div>
								</div>
							</div>
							{/* <!--end of row-->*/}
						</div>
						{/* <!--end of container-->*/}
					</section>

					<section className="commentors">
						<div className="background-image-holder blur-4--no-remove">
							<img
								className="background-image"
								src="/images/school-athens.jpg"
								role="presentation"
							/>
						</div>
						<div className="block-screen" />

						<div className="container">
							<h2 className="block-title">Commenters</h2>
							<CommentersList
								featureOnHomepage
								defaultAvatarUrl='/images/default_user.jpg'
								limit={3}
							/>
							<RaisedButton
								href="/commenters"
								className="cover-link light show-more "
								label="Other Commenters"
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
							{this.data.commentsReady ?
								<Commentary
									isOnHomeView
									filters={[]}
									comments={this.data.comments}
									commentsReady={this.data.commentsReady}
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
