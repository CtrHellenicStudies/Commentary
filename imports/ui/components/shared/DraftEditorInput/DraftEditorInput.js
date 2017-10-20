import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { EditorState} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';


class DraftEditorInput extends Component {

	static propTypes = {
		// props recieved from formsy HOC:
		onChange: PropTypes.func.isRequired,
		spellcheck: PropTypes.bool,
		placeholder: PropTypes.string.isRequired,
		keywordsMention: PropTypes.bool,
		singleLine: PropTypes.bool,
		stripPastedStyles: PropTypes.bool,
		editorState: PropTypes.object.isRequired,
		InlineToolbar : PropTypes.func //Remember that if you want use InlineToolbar, you also need plugin for it
	};
	constructor(props){
		super(props);
		this.mentionPlugin = createMentionPlugin();
		this.plugins = this.getPlugins();
	}
	state = {
		suggenstions: EditorState.createEmpty(),
		editorState: this.props.editorState
	};
	onEditorChange = (editorState) => {
		this.setState({
			editorState: editorState
		});
		console.log("I am");
		//this.props.onChange(_editorState);
	}
	
	onMentionSearchChange = ({ value }) => {
		// use Meteor call method, as comments are not available on clint app
		this.setState({
			suggenstions: defaultSuggestionsFilter(value, [{key: "1", name: "Ania"},{key: "2", name: "Jasio"}])
		});
	}
	getPlugins(){
		let ret = [this.mentionPlugin];
		// if(this.props.plugins)
		// 	ret = ret.concat(this.props.plugins);
		// ret = !this.props.InlineToolbar ? [inlineToolbarPlugin].concat(ret) : ret; //Is there any custom InlineToolbar
		// ret = this.props.singleLine === true ? ret.concat([singleLinePlugin]) : ret;
		return ret;
	}
	render() {
		//const InlineToolbar = this.props.singleLine ? undefined : (this.props.InlineToolbar || inlineToolbarPlugin.InlineToolbar);
		const { MentionSuggestions } = this.mentionPlugin;
		return (
			<div className="draft-editor-input">
				<div>
					<Editor
						editorState={this.state.editorState}
						onChange={this.onEditorChange}
						plugins = {this.plugins}
						ref={(element) => { this.editor = element; }}
						//{...this.plainAttributes}
						//placeholder={this.props.placeholder}
						//blockRenderMap={this.props.blockRenderMap}
						//{...this.props.ref !== undefined ? (ref = this.props.ref) : ''}
					/>
						<MentionSuggestions
						onSearchChange={this.onMentionSearchChange}
						suggestions={this.state.suggenstions}
							/>
				</div>
				{/* { InlineToolbar !== undefined ?
					(<div className="inline-toolbar-wrap">
						<InlineToolbar />
					</div>) : ''
				} */}
			</div>
		);
	}
}

export default DraftEditorInput;
