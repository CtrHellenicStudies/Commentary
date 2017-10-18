import React from 'react';
import PropTypes from 'prop-types';
import { HOC as formsyHOC } from 'formsy-react';
import stylePropType from 'react-style-proptype';
import reactCSS from 'reactcss';
import { EditorState, convertToRaw, convertFromRaw, convertFromHTML, ContentState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createInlineToolbarPlugin, { Separator } from 'draft-js-inline-toolbar-plugin';
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

	_onEditorChange(editorState) {
		this.setState({
			editorState
		});
		this.props.onChange(editorState);
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
		const InlineToolbar = this.props.InlineToolbar;
		return (
			<div className="draft-editor-input">
				{this.props.label !== undefined ? (<div style={styles.label}>{this.props.label}</div>) : ''}
				<div style={styles.editor}>
					<Editor
						editorState={this.props.editorState}
						onChange={this._onEditorChange.bind(this)}
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
