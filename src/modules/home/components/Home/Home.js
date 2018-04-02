import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import { compose } from 'react-apollo';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

// lib
import Utils from '../../../../lib/utils';
import muiTheme from '../../../../lib/muiTheme';

// graphql
import settingsQuery from '../../../settings/graphql/queries/list';

// components:
import BackgroundImageHolder from '../../../shared/components/BackgroundImageHolder/BackgroundImageHolder';
import CommentersList from '../../../commenters/components/CommenterList/CommentersList';
import KeywordsList from '../../../keywords/components/KeywordsList/KeywordsList';
import LoadingHome from '../../../../components/loading/LoadingHome';

// layouts:
import CommentaryContainer from '../../../comments/containers/CommentaryContainer';


class Home extends Component {
	constructor(props) {
		super(props);
		this.scrollToIntro = this.scrollToIntro.bind(this);
		this.state = {};
	}
	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	scrollToIntro(e) {
		$('html, body').animate({ scrollTop: $('#intro').offset().top - 100 }, 300);

		e.preventDefault();
	}
	componentWillReceiveProps(nextProps) {
		const tenantId = sessionStorage.getItem('tenantId');

		this.setState({
			settings: nextProps.settingsQuery.loading ? {} : nextProps.settingsQuery.settings.find(x => x.tenantId === tenantId),
			ready: !nextProps.settingsQuery.loading
		});
	}
	render() {
		let imageUrl = `${window.location.origin}/images/hector.jpg`;
		let introImage = '/images/ajax_achilles_3.jpg';
		let introImageCaption = '';
		const { settings, ready } = this.state;

		if (!settings) {
			return <LoadingHome />;
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
			introImageCaption = Utils.getHtmlFromContext(Utils.getEditorState(settings.homepageIntroductionImageCaption).getCurrentContent());
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
									<Link to="/commentary">
										<RaisedButton
											className="cover-link go-to-commentary"
											label="Go to Commentary"
										/>
									</Link>
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
									{ready ? settings.introBlocks.map((block, i) => (
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
													<Link to={block.linkURL}>
														<RaisedButton
															className="intro-block-link cover-link dark"
															label={block.linkText}
														/>
													</Link>
												</div>
											: ''}
										</div>
									)) : ''}
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
								defaultAvatarUrl="/images/default_user.jpg"
								limit={3}
							/>
							<Link to="/commenters">
								<RaisedButton
									className="cover-link light show-more "
									label="Other Commentators"
								/>
							</Link>
						</div>
					</section>
					{/*
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
					*/}

					<section className="keywords">
						<div className="grid inner">
							<h2 className="keyword-divider-title">Words</h2>
							<div className="underline" />
							<KeywordsList type="word" title="Words" limit={5} />
							<Link to="/words">
								<RaisedButton
									className="cover-link show-more primary "
									label="More Words"
								/>
							</Link>
						</div>
					</section>

					<section className="keywords keyideas">
						<div className="grid inner">
							<h2 className="keyword-divider-title">Ideas</h2>
							<div className="underline" />
							<KeywordsList type="idea" title="Ideas" limit={5} />
							<Link to="/ideas">
								<RaisedButton
									className="cover-link show-more primary "
									label="More Ideas"
								/>
							</Link>
						</div>
					</section>

					{/*
						<section className="get-started">
						<h2 className="block-title">Get Started</h2>
						<div className="get-started-comments">
							{ready ?
								<CommentaryContainer
									isOnHomeView
									filters={[]}
									skip={0}
									limit={10}
								/> : ''
							}
							<div className="read-more-link">
								<Link to="/commentary">
									<RaisedButton
										className="cover-link light show-more "
										label="Read More"
									/>
								</Link>

							</div>
						</div>
					</section>
					*/}
				</div>
			</div>
		);
	}
}


Home.propTypes = {
	settingsQuery: PropTypes.object,
	isTest: PropTypes.bool,
};

Home.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};

export default compose(settingsQuery)(Home);
