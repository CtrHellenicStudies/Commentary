import React from 'react';
import PropTypes from 'prop-types';
import { HOC as formsyHOC } from 'formsy-react';
import stylePropType from 'react-style-proptype';
import reactCSS from 'reactcss';
import { EditorState, convertToRaw, convertFromRaw, convertFromHTML, ContentState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createInlineToolbarPlugin, { Separator } from 'draft-js-inline-toolbar-plugin';
import { stateToHTML } from 'draft-js-export-html';
import {
	ItalicButton,
	BoldButton,
	UnderlineButton,
	CodeButton,
	HeadlineOneButton,
	HeadlineTwoButton,
	HeadlineThreeButton,
	UnorderedListButton,
	OrderedListButton,
	BlockquoteButton,
	CodeBlockButton,
} from 'draft-js-buttons';


class DraftEditorInput extends React.Component {

	static propTypes = {
		// props recieved from formsy HOC:
		onChange: PropTypes.func.isRequired,
		// getValue: PropTypes.func.isRequired,
		// showRequired: PropTypes.func.isRequired,
		// showError: PropTypes.func.isRequired,
		label: PropTypes.string.isRequired,

		style: stylePropType,
		value: PropTypes.object,
		defaultValue: PropTypes.object,
		defaultHTML: PropTypes.func,
		placeholder: PropTypes.string,
		returnHTML: PropTypes.bool,
		editorState: PropTypes.object.isRequired
	};
	constructor(props){
		super(props);
		this.inlineToolbarPlugin = createInlineToolbarPlugin({
			structure: [
				BoldButton,
				ItalicButton,
				UnderlineButton,
				CodeButton,
				Separator,
				HeadlineOneButton,
				HeadlineTwoButton,
				HeadlineThreeButton,
				UnorderedListButton,
				OrderedListButton,
				BlockquoteButton,
				CodeBlockButton,
			]
		});
		this.plugins = this.props.plugins.concat([this.inlineToolbarPlugin]);

		this.InlineToolbar = this.inlineToolbarPlugin.InlineToolbar;

	}

	_onEditorChange(editorState) {
		const { setValue, returnHTML } = this.props;
		this.setState({
			editorState
		});
		if (returnHTML) {
			this.props.onChange(editorState);
		} else {
			this.props.onChange(editorState);
		}
	}

	render() {

		const styles = reactCSS({
			default: {
				label: {
					paddingBottom: 6,
				},
				editor: {
					boxSizing: 'border-box',
					border: '1px solid #ddd',
					cursor: 'text',
					padding: '16px',
					borderRadius: 2,
					boxShadow: 'inset 0 1px 8px -3px #ccc',
					background: '#fff',
				}
			},
		});
		const InlineToolbar = this.InlineToolbar;
		return (
			<div className="draft-editor-input">
				<div style={styles.label}>{this.props.label}</div>
				<div style={styles.editor}>
					<Editor
						editorState={this.props.editorState}
						onChange={this._onEditorChange.bind(this)}
						plugins={this.props.plugin}
						placeholder={this.props.placeholder}
						plugins={this.plugins}
						blockRenderMap={this.props.blockRenderMap}
					/>
				</div>
				<div className="inline-toolbar-wrap">
					<InlineToolbar />
				</div>
			</div>
		);
	}
}

export default formsyHOC(DraftEditorInput);
