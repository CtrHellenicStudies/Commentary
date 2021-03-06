import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import _s from 'underscore.string';


// slider settings
const settings = {
	dots: true,
	arrows: false,
	infinite: true,
	autoplay: true,
	speed: 300,
	autoplaySpeed: 10000,
	slidesToShow: 1,
	slidesToScroll: 1,
};


class CommentsRecent extends React.Component {
	render() {
		const { comments } = this.props;

		if (!comments) {
			return null;
		}

		return (
			<section className="background-gray recent-comments">
				<div className="container">
					<div className="row">
						<div className="col-sm-8 col-sm-offset-2 text-center">
							<h3 className=" uppercase">
								Recently from the Commentary
							</h3>
							<i className="mdi mdi-format-quote quote-icon" />
							<Slider {...settings}>
								{comments.map(comment => (
									<div
										key={comment._id}
									>
										<p
											dangerouslySetInnerHTML={{
												__html: _s.truncate(comment.revisions[comment.revisions.length - 1].text, 300),
											}}
										/>
										<h4>
											-
											{comment.commenters.map(commenter => (
												` ${commenter.name},`
											))}
											{comment.work ? ` ${comment.work.title} ${
												comment.subwork.title}.${comment.lineFrom}-${
												comment.lineFrom + comment.nLines}`: ''}
										</h4>
									</div>
								))}
							</Slider>
						</div>
					</div>
				</div>
			</section>
		);
	}
}

CommentsRecent.PropTypes = {
	comments: PropTypes.array,
};

CommentsRecent.defaultProps = {
	comments: [],
};

export default CommentsRecent;
