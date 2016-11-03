ReferenceWorkDetail = React.createClass({

	propTypes: {
		slug: React.PropTypes.string.isRequired,
	},

	mixins: [ReactMeteorData],

	getMeteorData() {
		const query = {
			slug: this.props.slug,
		};

		return { referenceWork: ReferenceWorks.findOne(query) };
	},

	createMarkup() {
		return {
			__html: this.data.referenceWork.description.replace(/(<([^>]+)>)/ig, ''),
		};
	},

	render() {
		const referenceWork = this.data.referenceWork;

		if (!referenceWork) {
			return <div />;
		}
		return (
			<div className="page reference-works-page reference-works-detail-page">
				<div className="content primary">
					<section className="block header header-page	cover parallax">
						<div className="background-image-holder blur-2--no-remove remove-blur	blur-10">
							<img className="background-image" src="/images/apotheosis_homer.jpg" />
						</div>
						<div className="block-screen brown" />

						<div className="container v-align-transform">
							<div className="grid inner">
								<div className="center-content">
									<div className="page-title-wrap">
										<h2 className="page-title ">{referenceWork.title}</h2>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="page-content">
						<p
							dangerouslySetInnerHTML={this.createMarkup()}
						>
						</p>
					</section>
				</div>
			</div>
		);
	},

});
