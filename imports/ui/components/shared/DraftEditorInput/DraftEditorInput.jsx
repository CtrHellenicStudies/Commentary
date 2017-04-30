import { HOC as formsyHOC } from 'formsy-react'; // eslint-disable-line import/no-unresolved
import stylePropType from 'react-style-proptype'; // eslint-disable-line import/no-unresolved
import reactCSS from 'reactcss';
import { EditorState, convertToRaw, convertFromRaw, convertFromHTML, ContentState } from 'draft-js'; // eslint-disable-line import/no-unresolved
import Editor from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createInlineToolbarPlugin, { Separator } from 'draft-js-inline-toolbar-plugin'; // eslint-disable-line import/no-unresolved
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
} from 'draft-js-buttons'; // eslint-disable-line import/no-unresolved


class DraftEditorInput extends React.Component {

	static propTypes = {
		// props recieved from formsy HOC:
		setValue: React.PropTypes.func.isRequired,
		// getValue: React.PropTypes.func.isRequired,
		getErrorMessage: React.PropTypes.func.isRequired,
		// showRequired: React.PropTypes.func.isRequired,
		// showError: React.PropTypes.func.isRequired,
		label: React.PropTypes.string.isRequired,

		style: stylePropType,
		value: React.PropTypes.object,
		defaultValue: React.PropTypes.object,
		defaultHTML: React.PropTypes.func,
		placeholder: React.PropTypes.string,
		returnHTML: React.PropTypes.bool,
	};

	static defaultProps = {
		style: {},
		value: convertToRaw(ContentState.createFromText('')),
		defaultValue: null,
		placeholder: null,
	};

	constructor(props) {
		super(props);

		const { value, defaultValue, defaultHTML } = props;
		// defaultValue dominance over value prop:
		const contentStateRaw = defaultValue || value;
		let editorState;

		if (defaultHTML) {
			const blocksFromHTML = convertFromHTML(defaultHTML());
			const state = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
			editorState = EditorState.createWithContent(state);
		} else {
			editorState = EditorState.createWithContent(convertFromRaw(contentStateRaw));
		}

		// this._onEditorChange = debounce(500, this._onEditorChange);

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

		this.InlineToolbar = this.inlineToolbarPlugin.InlineToolbar;

		this.state = {
			editorState,
		};
	}

	componentDidMount() {
		const { defaultValue, setValue } = this.props;

		// if defaultValue is and value is not provided,
		// set the formsy element value to defaultValue;
		if (defaultValue) setValue(defaultValue);
	}

	_onEditorChange(editorState) {
		const { setValue, returnHTML } = this.props;
		this.setState({
			editorState
		});
		if (returnHTML) {
			setValue(stateToHTML(editorState.getCurrentContent()));
		} else {
			setValue(convertToRaw(editorState.getCurrentContent()));
		}
	}

	render() {
		const { getErrorMessage, style, label, placeholder } = this.props;
		const { editorState } = this.state;

		const errorMessage = getErrorMessage();

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
			<div style={style} className="draft-editor-input">
				<div style={styles.label}>{label}</div>
				<div style={styles.editor}>
					<Editor
						editorState={editorState}
						onChange={this._onEditorChange.bind(this)}
						plugins={[this.inlineToolbarPlugin]}
						placeholder={placeholder}
					/>
				</div>
				<span>{errorMessage}</span>
				<div className="inline-toolbar-wrap">
					<InlineToolbar />
				</div>
			</div>
		);
	}
}

export default formsyHOC(DraftEditorInput);
