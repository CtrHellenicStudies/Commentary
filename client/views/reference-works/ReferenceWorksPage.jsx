ReferenceWorksPage = React.createClass({

	propTypes: {
		title: React.PropTypes.string.isRequired,
	},

	render() {
		return (
			<div className="page reference-works-page">
				<div className="content primary">
					<section className="block header header-page	cover parallax">
						<div className="background-image-holder blur-2--no-remove remove-blur	blur-10">
							<img className="background-image" src="/images/achilles_2.jpg"/>
						</div>
						<div className="block-screen brown"/>

						<div className="container v-align-transform">
							<div className="grid inner">
								<div className="center-content">
									<div className="page-title-wrap">
										<h2 className="page-title ">Reference Works</h2>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="page-content">
						<ReferenceWorksList />
					</section>
				</div>
			</div>
		);
	},

});
