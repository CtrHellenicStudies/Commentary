import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Field, reduxForm } from 'redux-form';
import cookie from 'react-cookie';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Utils from '/imports/lib/utils';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { compose } from 'react-apollo';

// graphql
import { referenceWorksQuery } from '/imports/graphql/methods/referenceWorks';

// models
import Keywords from '/imports/models/keywords';
import ReferenceWorks from '/imports/models/referenceWorks';

// lib:
import muiTheme from '/imports/lib/muiTheme';

// components
import { ListGroupDnD, createListGroupItemDnD } from '/imports/ui/components/shared/ListDnD';
import CommentRevisionSelect from '/imports/ui/components/commentary/comments/CommentRevisionSelect';
import LinkButton from '../../addComment/LinkButton';
import TagsInput from '../../addComment/TagsInput';
import TitleInput from '../../addComment/TitleInput';
import ReferenceWorksInput from '../../addComment/ReferenceWorksInput';
import CommentContentInput from '../../addComment/CommentContentInput';
import CommentActionButtons from '../CommentActionButtons';
import AddRevisionButton from '../AddRevisionButton';
import RemoveRevisionButton from '../RemoveRevisionButton';
import UpdateRevisionButton from '../UpdateRevisionButton';




class AddRevision extends React.Component {

	static propTypes = {
		submitForm: PropTypes.func.isRequired,
		update: PropTypes.func.isRequired,
		comment: PropTypes.object.isRequired,
		tags: PropTypes.array,
		referenceWorkOptions: PropTypes.array,
		filters: PropTypes.array,
	}

	constructor(props) {
		super(props);

		this.state = {
			selectedRevisionIndex: null,
		};
	}

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	_enableButton() {
		this.setState({
			canSubmit: true,
		});
	}

	_disableButton() {
		this.setState({
			canSubmit: false,
		});
	}

	getRevisionIndex() {
		const { comment, filters } = this.props;
		let selectedRevisionIndex = this.state.selectedRevisionIndex;
		if (selectedRevisionIndex === null) {
			selectedRevisionIndex = 0;
		}
		return selectedRevisionIndex;
	}

	selectRevision(event) {
		this.setState({
			selectedRevisionIndex: parseInt(event.currentTarget.id, 10),
		});
	}

	handleSubmit() {
		const { textEditorState } = this.state;

		// create html from textEditorState's content
		const textHtml = Utils.getHtmlFromContext(textEditorState.getCurrentContent());

		const textRaw = convertToRaw(textEditorState.getCurrentContent());

		this.props.submitForm(this.state, textHtml, textRaw);
	}

	render() {
		const { comment } = this.props;
		const { referenceWorkOptions, tags } = this.props;

		const selectedRevisionIndex = this.getRevisionIndex();
		const selectedRevision = comment.revisions[selectedRevisionIndex];

		return (
			<form onSubmit={this.handleSubmit} >
				<div className="comments lemma-panel-visible">
					<div className="comment-outer">
						<article className="comment commentary-comment paper-shadow">
							<div className="comment-upper">
								<CommentActionButtons
									commentId={comment._id}
								/>
								<TitleInput
									placeholder="Comment title . . ."
								/>
								<TagsInput />
							</div>

							<div className="comment-lower clearfix">
								<CommentContentInput />
								<ReferenceWorksInput />
								<AddRevisionButton
									commentId={comment._id}
								/>
								<RemoveRevisionButton
									commentId={comment._id}
								/>
								<UpdateRevisionButton
									commentId={comment._id}
								/>
							</div>

							<div className="comment-revisions-outer">
								<CommentRevisionSelect
									commentId={comment._id}
									revisions={comment.revisions}
									comment={comment}
									selectedRevisionIndex={selectedRevisionIndex}
									selectRevision={this.selectRevision}
								/>
							</div>
						</article>
					</div>
				</div>
			</form>
		);
	}
}


const AddRevisionContainer = createContainer((props) => {

	const { comment } = props;
	const tenantId = Session.get('tenantId');
	Meteor.subscribe('keywords.all', {tenantId: tenantId});

	const tags = Keywords.find().fetch();

	if (tenantId) {
		props.referenceWorksQuery.refetch({
			tenantId: tenantId
		});
	}
	const referenceWorks = props.referenceWorksQuery.loading ? [] : props.referenceWorksQuery.referenceWorks;
	const referenceWorkOptions = [];
	referenceWorks.forEach((referenceWork) => {
		if (!referenceWorkOptions.some(val => (
			referenceWork.slug === val.slug
		))) {
			referenceWorkOptions.push({
				value: referenceWork._id,
				label: referenceWork.title,
				slug: referenceWork.slug,
			});
		}
	});

	return {
		tags,
		referenceWorkOptions,
	};
}, AddRevision);


AddRevision.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};

/*
 * Make the redux form
 */
const AddRevisionForm = reduxForm({
	form: 'addRevision'
})(AddRevisionContainer);


export default compose(referenceWorksQuery)(AddRevisionForm);
