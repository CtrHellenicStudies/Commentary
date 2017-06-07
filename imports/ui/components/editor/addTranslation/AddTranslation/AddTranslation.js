import React from 'react';
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer, ReactMeteorData } from 'meteor/react-meteor-data';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Editor, EditorState } from 'draft-js';

// api
import Commenters from '/imports/api/collections/commenters';

// lib
import muiTheme from '/imports/lib/muiTheme';

// Create toolbar plugin for editor

class AddTranslation extends React.Component {
	//noinspection JSAnnotator
	static propTypes: {
		//noinspection JSAnnotator
		selectedLineFrom: React.PropTypes.number,
		//noinspection JSAnnotator
		selectedLineTo: React.PropTypes.number,
		//noinspection JSAnnotator
		submitForm: React.PropTypes.func.isRequired,
		//noinspection JSAnnotator
		onTypeChange: React.PropTypes.func.isRequired,
		//noinspection JSAnnotator
		isTest: React.PropTypes.bool,
	}

	constructor(props) {
		super(props);
		this.onChange = (editorState) => this.setState({editorState});
		this.state = {
			titleEditorState: EditorState.createEmpty(),
			textEditorState: EditorState.createEmpty(),
			editorState: EditorState.createEmpty(),
		}
	}



	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	render() {
		const { isTest } = this.props;

		if (isTest) {
			return null;
		}

		return (
			<div className="comments lemma-panel-visible">
				<div className={'comment-outer'}>
					<article
						className="comment commentary-comment paper-shadow "
						style={{ marginLeft: 0 }}
					>
						<div
							className="comment-lower"
							style={{ paddingTop: 20, paddingBottom: 20 }}
						>
							<Editor
								editorState={this.state.editorState}
								onChange={this.onChange}
								placeholder="Translation . . ."
								spellCheck
								stripPastedStyles
							/>
						</div>
					</article>
				</div>
			</div>
		);
	}
}

AddTranslation.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
}

const AddTranslationContainer = createContainer(() => {
	Meteor.subscribe('commenters', Session.get('tenantId'));
	const commentersOptions = [];
	let commenters = [];
	if (Meteor.user() && Meteor.user().canEditCommenters) {
		commenters = Commenters.find({ _id: { $in: Meteor.user().canEditCommenters } }).fetch();
	}
	commenters.forEach((commenter) => {
		commentersOptions.push({
			value: commenter._id,
			label: commenter.name,
		});
	});

	return {
		commentersOptions,
	};

}, AddTranslation);

export default AddTranslationContainer;


