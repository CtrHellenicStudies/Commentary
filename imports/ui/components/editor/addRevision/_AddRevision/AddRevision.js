import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Field, reduxForm } from 'redux-form'
import cookie from 'react-cookie';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// api
import Keywords from '/imports/models/keywords';
import ReferenceWorks from '/imports/models/referenceWorks';

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

// lib:
import muiTheme from '/imports/lib/muiTheme';



class AddRevision extends React.Component {

	static propTypes = {
		submitForm: React.PropTypes.func.isRequired,
		update: React.PropTypes.func.isRequired,
		comment: React.PropTypes.object.isRequired,
		tags: React.PropTypes.array,
		referenceWorkOptions: React.PropTypes.array,
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
		const textHtml = convertToHTML({

			// performe necessary html transformations:
			entityToHTML: (entity, originalText) => {

				// handle LINK
				if (entity.type === 'LINK') {
					return <a href={entity.data.link} target="_blank" rel="noopener noreferrer">{originalText}</a>;
				}

				// handle keyword mentions
				if (entity.type === 'mention') {
					return <a className="keyword-gloss" data-link={Utils.getEntityData(entity, 'link')}>{originalText}</a>;
				}

				// handle hashtag / commets cross reference mentions
				if (entity.type === '#mention') {
					return <a className="comment-cross-ref" href={Utils.getEntityData(entity, 'link')}><div dangerouslySetInnerHTML={{ __html: originalText }} /></a>;
				}
			},
		})(textEditorState.getCurrentContent());

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


const AddRevisionContainer = createContainer(({ comment }) => {

	Meteor.subscribe('keywords.all', {tenantId: Session.get('tenantId')});

	const tags = Keywords.find().fetch();

	Meteor.subscribe('referenceWorks', Session.get('tenantId'));
	const referenceWorks = ReferenceWorks.find().fetch();
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
	muiTheme: React.PropTypes.object.isRequired,
};

/*
 * Make the redux form
 */
const AddRevisionForm = reduxForm({
  form: 'addRevision'
})(AddRevisionContainer)


export default AddRevisionForm;
