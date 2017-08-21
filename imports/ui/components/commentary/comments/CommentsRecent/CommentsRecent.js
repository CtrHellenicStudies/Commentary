import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Slider from 'react-slick';

// api
import Comments from '/imports/models/comments';

// lib:
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
	comments: React.PropTypes.arrayOf(React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
		revisions: React.PropTypes.arrayOf(React.PropTypes.shape({
			text: React.PropTypes.string.isRequired,
		})).isRequired,
		commenters: React.PropTypes.arrayOf(React.PropTypes.shape({
			name: React.PropTypes.string.isRequired,
		})).isRequired,
		work: React.PropTypes.shape({
			title: React.PropTypes.string.isRequired,
		}).isRequired,
		subwork: React.PropTypes.shape({
			title: React.PropTypes.string.isRequired,
		}).isRequired,
		lineFrom: React.PropTypes.number.isRequired,
		nLines: React.PropTypes.number.isRequired,
	})),
};
CommentsRecent.defaultProps = {
	comments: null,
};
/*
	END CommentsRecent
*/

export default createContainer(() => {
	const handle = Meteor.subscribe('comments.recent.tenant', Session.get('tenantId'), 3);
	let comments = [];
	if (handle.ready()) {
		comments = Comments.find({}, {
			sort: {
				updated: -1,
			},
		}).fetch();
	}
	return {
		comments,
	};
}, CommentsRecent);
