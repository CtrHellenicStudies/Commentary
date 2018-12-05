import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// lib
import muiTheme from '../../../../lib/muiTheme';

// layouts
import Header from '../../../../components/navigation/Header';

// components
import BackgroundImageHolder from '../../../shared/components/BackgroundImageHolder';

import './NotFound.css';


const NotFound = props => {
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
	let randomExpression = expressionsOfWoe[Math.round(Math.random() * expressionsOfWoe.length)];

	return (
		<div className="chs-layout master-layout not-found-layout">
			<MuiThemeProvider
				muiTheme={getMuiTheme(muiTheme)}
			>
				<Header />
			</ MuiThemeProvider>
			<div className="page page-not-found content primary">

				<section className="block header header-page	cover parallax">
					<BackgroundImageHolder
						imgSrc="/images/odysseus.jpg"
					/>

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
		</div>
	);
}


NotFound.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};

export default NotFound;
