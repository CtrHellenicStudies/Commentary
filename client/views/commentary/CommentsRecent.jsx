
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';

CommentsRecent = React.createClass({

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	render(){

		return (
			<section className="background-gray recent-comments">

				<div className="container">
						<div className="row">
								<div className="col-sm-8 col-sm-offset-2 text-center">
										<h3 className=" uppercase">
											Recently from the Commentary
										</h3>
										<i className="mdi mdi-format-quote quote-icon"></i>
										<div className="text-slider slider-arrow-controls">
												<ul className="slides">
														<li>
																<p >
																	Incidentally, it is also clear just from our Iliad that there could be another starting point for the tale of Achilles' wrath. When a bit later in Iliad 1 Achilles answers his mother's request to ἐξαυδᾶν 'speak out' what has befallen him, he begins . . .
																</p>
																<h4>&mdash; Douglas Frame, Iliad 1.4-6</h4>

														</li>
														{/*<li>
																<p >
																	Like every word in the epic song-generating system, this first word of the poem has dimensions that were disclosed to its original audiences and performers through age-old, recurrent exposure to poetry in performance. Those dimensions are invisible . . .
															 </p>
																<h4>&mdash; Leonard Muellner, Iliad 1.1</h4>

														</li>
														<li>
																<p >
																	Analysis and comparison of the beginnings of the arkhaia Ilias and of the Homeric Iliad that has come down to us
															 </p>
																<h4>&mdash; Gregory Nagy, Iliad 1.9</h4>

														</li>*/}
												</ul>
										</div>
								</div>
						</div>
				</div>

			</section>


			);
	}
});
