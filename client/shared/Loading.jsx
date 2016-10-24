Loading = React.createClass({
	render() {
		return (
			<div className="loading">
				<section className="page-head fullscreen bg-dark">
					<div className="background-screen cyan" />
					<div className="container v-align-transform">
						<div className="row">
							<div className="col-sm-10 col-sm-offset-1 text-center">
								<div className="well-spinner" />
							</div>
						</div>
					</div>
				</section>
			</div>
		);
	},
});
