import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

CommentsRecent = React.createClass({

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},
	render() {
		return (
			<section className="background-gray recent-comments">

				<div className="container">
					<div className="row">
						<div className="col-sm-8 col-sm-offset-2 text-center">
							<h3 className=" uppercase">
								Recently from the Commentary
							</h3>
							<i className="mdi mdi-format-quote quote-icon" />
							<div className="text-slider slider-arrow-controls">
								<ul className="slides">
									<li>
										<p >
											Incidentally, it is also clear just from our Iliad that there could be
											another starting point for the tale of Achilles' wrath. When a bit later in
											Iliad 1 Achilles answers his mother's request to ἐξαυδᾶν 'speak out' what
											has befallen him, he begins . . .
										</p>
										<h4>&mdash; Douglas Frame, Iliad 1.4-6</h4>

									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

			</section>


		);
	},
});
