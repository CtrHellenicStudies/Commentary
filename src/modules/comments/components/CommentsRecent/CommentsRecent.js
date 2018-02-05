import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';
import Slider from 'react-slick';


// lib:
import commentsQuery from '../../graphql/queries/comments';
import Utils from '../../../../lib/utils';


/*
	helpers
*/
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

/*
	BEGIN CommentsRecent
*/
class CommentsRecent extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			comments: nextProps.commentsQuery.loading ? [] : nextProps.commentsQuery.comments.slice(0,3)
		});
	}
	render() {
		const { comments } = this.state;
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
												__html: Utils.trunc(comment.revisions[comment.revisions.length - 1].text, 300),
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
CommentsRecent.propTypes = {
	commentsQuery: PropTypes.object
};
CommentsRecent.defaultProps = {
	comments: null,
};

export default compose(commentsQuery)(CommentsRecent);
