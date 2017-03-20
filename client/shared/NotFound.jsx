import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

NotFound = React.createClass({

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	componentDidMount() {
		this.backgroundImages();
		setTimeout(() => {
			const elem = document.querySelector('header');
			if (elem) {
				const headroom = new Headroom(elem);
				headroom.init();
			}
		}, 300);
	},

	backgroundImages() {
		setTimeout(() => {
			$('.background-image-holder').each(function appendImg() {
				const imgSrc = $(this).children('img').attr('src');
				$(this).css('background', `url("${imgSrc}")`);
				$(this).children('img').hide();
				$(this).css('background-position', 'initial');
				$(this).addClass('fadeIn');
			});

			// Fade in background images
			setTimeout(() => {
				$('.background-image-holder').each(function fadeImg() {
					$(this).removeClass('blur');
				});
			}, 500);
		}, 100);
	},

	render() {
		const expressionsOfWoe = [
			'ἰὼ ἰώ',
			'αἶ, αἶ',
			'οἴμοι μοι',
			'φεῦ φεῦ',
			'ἰώ μοί μοι',
			'ὦ Ζεῦ',
			'βοᾷ βοᾷ',
			'αἰαῖ αἰαῖ',
			'ἔα ἔα',
			'ὀττοτοτοτοτοῖ',
			'ἄλγος ἄλγος βοᾷς',
			'ἐλελεῦ',
			'μὴ γένοιτο',
			'οὐαί'
		];
		const randomExpression = expressionsOfWoe[Math.round(Math.random() * expressionsOfWoe.length)];
		const userIsLoggedin = false;

		return (
			<div className="chs-layout master-layout not-found-layout">
				<Header />
				<div className="page page-not-found content primary">

				<section className="block header header-page	cover parallax">
					<div className="background-image-holder blur-4--no-remove remove-blur	blur-10">
							<img
								className="background-image"
								role="presentation"
								src="/images/odysseus.jpg"
							/>
						</div>

						<div className="block-screen brown" />

						<div className="container v-align-transform">
							<div className="grid inner">
								<div className="center-content">
									<div className="page-title-wrap">
										<h1 className="page-title">
											{randomExpression}, 404 Error!
										</h1>
										<h2>Viewing this page is against the will of the gods</h2>
										<h4>(Or there's an error somewhere).</h4>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="page-content container">
						<p>
							Are you sure this is where you wanted to go?	If not, please return to the previous page with the back button.
						</p>
						<p>
							If this is a persistent error, please send us an email at <a href="mailto:muellner@chs.harvard.edu">muellner@chs.harvard.edu</a> and lament your woes (hexameter preferred).
						</p>
						<p>
							Please include what paths you were wandering and what device you were using when you went astray.
						</p>
						<p>
							Many thanks,
						</p>
						<p>
							The CHS IT team
						</p>
					</section>
				</div>
				<footer className="block-shadow">
					<div className="container">
						<div className="row footer-nav-row">
							<div className="footer-nav-links" role="navigation">
								<FlatButton
									href="/commentary"
									label="Commentary"
								/>
								<FlatButton
									href="/commenters"
									label="Commenters"
								/>
								<FlatButton
									href="/keywords"
									label="Keywords"
								/>
								<FlatButton
									href="/keyideas"
									label="Key Ideas"
								/>
								<FlatButton
									href="/about"
									label="About"
								/>
								{ userIsLoggedin ? '' :
									<div>
										<FlatButton
											href="/sign-in"
											label="Login"
										/>
										<FlatButton
											href="/sign-up"
											label="Join the Community"
										/>
									</div>
								}
							</div>
						</div>
						<div className="row mb64 mb-sm-32">
							<div className="col-md-5 text-right text-left-xs">
								<h1 className="logo">CHS Classical Commentaries</h1>
							</div>

							<div className="col-md-2 hidden-sm hidden-xs text-center">
								<a href="http://chs.harvard.edu" target="_blank" rel="noopener noreferrer">
									<img className="site-logo" src="/images/logo-tower.png" role="presentation" />
								</a>
							</div>

							<div className="col-md-5 col-sm-6 more-info-column">
								<p className="lead">
									This website is provided by <a href="http://chs.harvard.edu" target="_blank" rel="noopener noreferrer">
										The Center for Hellenic Studies
									</a>.
								</p>

							</div>
						</div>
						{/* <!--end of row-->*/}
						<div className="row">
							<div className="col-md-8 col-md-offset-2 col-sm-9 col-sm-offset-1 text-center">
								<p className="fade-1-4 copyright">
									See our <a href="/terms">terms and privacy policy</a>
								</p>
							</div>
						</div>
						{/* <!--end of row-->*/}
					</div>
					{/* <!--end of container-->*/}
				</footer>
			</div>
		);
	},
});
