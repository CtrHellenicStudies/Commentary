import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import { createContainer } from 'meteor/react-meteor-data';
import { compose } from 'react-apollo';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Slider from 'react-slick';

// models
import Comments from '/imports/models/comments';

// lib:
import { commentsQuery } from '/imports/graphql/methods/comments';
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';


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
const CommentsRecent = ({ comments }) => {
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
										{` ${comment.work.title} ${
										comment.subwork.title}.${comment.lineFrom}-${
										comment.lineFrom + comment.nLines}`}
									</h4>
								</div>
							))}
						</Slider>
					</div>
				</div>
			</div>
		</section>
	);
};
CommentsRecent.propTypes = {
	comments: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
		revisions: PropTypes.arrayOf(PropTypes.shape({
			text: PropTypes.string.isRequired,
		})).isRequired,
		commenters: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
		})).isRequired,
		work: PropTypes.shape({
			title: PropTypes.string.isRequired,
		}).isRequired,
		subwork: PropTypes.shape({
			title: PropTypes.string.isRequired,
		}).isRequired,
		lineFrom: PropTypes.number.isRequired,
		nLines: PropTypes.number.isRequired,
	})),
};
CommentsRecent.defaultProps = {
	comments: null,
};
/*
	END CommentsRecent
*/
const cont = createContainer(props => {
	props.commentsQuery.refetch({
		limit: 3,
	});
	const comments = props.commentsQuery.loading ? [] : props.commentsQuery.comments;
	return {
		comments,
	};
}, CommentsRecent);
export default compose(commentsQuery)(cont);
