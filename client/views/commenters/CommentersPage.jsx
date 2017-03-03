CommentersPage = React.createClass({

	mixins: [ReactMeteorData],

	getMeteorData() {
		const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

		return {
			settings: settingsHandle.ready() ? Settings.findOne() : { title: '' }
		};
	},

	render() {
		const { settings } = this.data;
		Utils.setTitle(`Commenters | ${settings.title}`);
		Utils.setDescription(`Commenters for ${Config.title()}`);
		Utils.setMetaImage(`${location.origin}/images/capitals.jpg`);
		return (
			<div className="page page-commenters">
				<div className="content primary">
					<section className="block header cover parallax">
						<div className="background-image-holder blur-2--no-remove blur-10 remove-blur">
							<img
								className="background-image"
								src="/images/capitals.jpg"
								alt="Commenter Page | A Homer Commentary in Progress"
							/>
						</div>
						<div className="block-screen brown" />
						<div className="container v-align-transform">
							<div className="grid inner">
								<div className="center-content">
									<div className="page-title-wrap">
										<h2 className="page-title ">
											Commenters
										</h2>
									</div>
								</div>
							</div>
						</div>
					</section>
					<section className="page-content">

						<CommentersList defaultAvatarUrl="/images/default_user.jpg" />

					</section>

					<CommentsRecent />
				</div>

			</div>
		);
	},
});
