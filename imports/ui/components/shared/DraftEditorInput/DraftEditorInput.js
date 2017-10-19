import React from 'react';
import PropTypes from 'prop-types';
import { HOC as formsyHOC } from 'formsy-react';
import stylePropType from 'react-style-proptype';
import reactCSS from 'reactcss';
import { EditorState, convertToRaw, convertFromRaw, convertFromHTML, ContentState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { Separator } from 'draft-js-inline-toolbar-plugin';
import { stateToHTML } from 'draft-js-export-html';


class DraftEditorInput extends React.Component {

	static propTypes = {
		// props recieved from formsy HOC:
		onChange: PropTypes.func.isRequired,
		style: stylePropType,
		placeholder: PropTypes.string,
		returnHTML: PropTypes.bool,
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
		const InlineToolbar = this.props.InlineToolbar;
		return (
			<div className="draft-editor-input">
				{this.props.label !== undefined ? (<div >{this.props.label}</div>) : ''}
				<div>
					<Editor
						editorState={this.props.editorState}
						onChange={this.onEditorChange}
						plugins={this.props.plugin}
						placeholder={this.props.placeholder}
						plugins={this.props.plugins}
						blockRenderMap={this.props.blockRenderMap}
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
