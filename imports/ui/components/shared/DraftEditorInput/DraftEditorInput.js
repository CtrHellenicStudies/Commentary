import React from 'react';
import PropTypes from 'prop-types';
import { HOC as formsyHOC } from 'formsy-react';
import stylePropType from 'react-style-proptype';
import reactCSS from 'reactcss';
import { EditorState, convertToRaw, convertFromRaw, convertFromHTML, ContentState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createInlineToolbarPlugin, { Separator } from 'draft-js-inline-toolbar-plugin';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import LinkButton from '/imports/ui/components/editor/addComment/LinkButton';
import {
	ItalicButton,
	BoldButton,
	UnderlineButton,
	UnorderedListButton,
	OrderedListButton,
	BlockquoteButton,
} from 'draft-js-buttons';

const singleLinePlugin = createSingleLinePlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin({
	structure: [
		BoldButton,
		ItalicButton,
		UnderlineButton,
		Separator,
		UnorderedListButton,
		OrderedListButton,
		BlockquoteButton,
		LinkButton,
	]
});

class DraftEditorInput extends React.Component {

	static propTypes = {
		// props recieved from formsy HOC:
		onChange: PropTypes.func.isRequired,
		spellcheck: PropTypes.bool,
		placeholder: PropTypes.string.isRequired,
		singleLine: PropTypes.bool,
		stripPastedStyles: PropTypes.bool,
		editorState: PropTypes.object.isRequired,
		InlineToolbar : PropTypes.func //Remember that if you want use InlineToolbar, you also need plugin for it
	};
	constructor(props){
		super(props);
		this.onEditorChange = this.onEditorChange.bind(this);
	}
	onEditorChange(editorState) {
		this.props.onChange(editorState);
	}

	render() {
		let plugins = this.props.InlineToolbar === undefined ? [inlineToolbarPlugin].concat(this.props.plugins) : this.props.plugins;
		plugins = this.props.singleLine === true ? [singleLinePlugin] : plugins;
		const InlineToolbar = this.props.singleLine ? undefined : (this.props.InlineToolbar || inlineToolbarPlugin.InlineToolbar);
		const plainAttributes = {
			spellCheck : this.props.spellcheck == true ?  true : false,
			stripPastedStyles : this.props.stripPastedStyles === true ? true : false
		}
		return (
			<div className="draft-editor-input">
				{this.props.label !== undefined ? (<div >{this.props.label}</div>) : ''}
				<div>
					<Editor
						editorState={this.props.editorState}
						onChange={this.onEditorChange}
						plugins = {plugins}
						{...plainAttributes}
						placeholder={this.props.placeholder}
						blockRenderMap={this.props.blockRenderMap}
						{...this.props.ref !== undefined ? (ref = this.props.ref) : ''}
					/>
				</div>
				{ InlineToolbar !== undefined ?
					(<div className="inline-toolbar-wrap">
						<InlineToolbar />
					</div>) : ''
				}
			</div>
		);
	}
}

export default formsyHOC(DraftEditorInput);
