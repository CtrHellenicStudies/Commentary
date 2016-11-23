ReferenceWorkDetail = React.createClass({

	propTypes: {
		slug: React.PropTypes.string.isRequired,
	},

	mixins: [ReactMeteorData],

	getMeteorData() {
		// SUBSCRIPTIONS:
		const referenceWorksSub = Meteor.subscribe('referenceWorks.slug', this.props.slug);

		// FETCH DATA:
		const query = {
			slug: this.props.slug,
		};
		const referenceWork = ReferenceWorks.findOne(query, {
			sort: {
				title: 1
			}
		});

		return {
			referenceWork,
		};
	},

	createMarkup() {
		let __html = '';
		if (this.data.referenceWork) {
			__html = this.data.referenceWork.description.replace(/(<([^>]+)>)/ig, '');
		}
		return {
			__html,
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
					<section className="block header header-page cover parallax">
						<div className="background-image-holder blur-2--no-remove remove-blur blur-10">
							<img
								className="background-image"
								src="/images/apotheosis_homer.jpg"
								role="presentation"
							/>
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
						/>
					</section>
				</div>
			</div>
		);
	},

});
