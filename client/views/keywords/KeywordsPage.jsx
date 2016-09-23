KeywordsPage = React.createClass({

	propTypes: {
			type: React.PropTypes.string.isRequired,
			title: React.PropTypes.string.isRequired
	},

	render() {

		 return (
			 <div className="page keywords-page">

					<div data-ng-controller="PageController as page" className="content primary">

							<section className="block header header-page	cover parallax">
									<div className="background-image-holder blur-2--no-remove remove-blur	blur-10">
											<img className="background-image" src="/images/apotheosis_homer.jpg"/>
									</div>
									<div className="block-screen brown"></div>

									<div className="container v-align-transform">

											<div className="grid inner">
													<div className="center-content">

															<div className="page-title-wrap">
																	<h2 className="page-title ">{this.props.title}</h2>
															</div>


													</div>
											</div>
									</div>
							</section>
							<section className="page-content">
								<KeywordsList type={this.props.type} />

							</section>


					</div>



			 </div>


			);
		}


});
