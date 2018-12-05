import React from 'react';

const LoadingHome = () => (
	<div className="loading home">
		<div className="loading-mock home-filler home-filler-header" />
		<div className="content primary">
			<section className="header cover fullscreen parallax">
				<div
					className="container v-align-transform wow fadeIn"
					data-wow-duration="1s"
					data-wow-delay="0.1s"
				>
					<div className="grid inner">
						<div className="center-content">
							<div className="site-title-wrap">
								<div className="loading-mock home-filler home-filler-1" />
								<div className="loading-mock home-filler home-filler-1" />
								<div className="loading-mock home-filler home-filler-2" />
								<div>
									<div className="loading-mock home-filler home-filler-3" />
									<div className="loading-mock home-filler home-filler-3" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
		<div className="loading-mock home-filler home-filler-scroll-down" />
	</div>
);

export default LoadingHome;
