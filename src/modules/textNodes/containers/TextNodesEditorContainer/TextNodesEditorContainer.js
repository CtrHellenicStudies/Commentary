import React from 'react';

// components
import TextNodesEditor from '../../components/TextNodesEditor/TextNodesEditor';

const TextNodesEditorContainer = class TextNodesEditorContainerClass extends React.Component {
    
	constructor(props) {
		super(props);
		this.state ={
		};
	}
	componentWillReceiveProps(props) {

	}
	render() {
		const textNodesUrn = this.setState.textNodesUrn ? this.state.textNodesUrn : 'urn:cts:greekLit:tlg0013.tlg001:1.1-2.1';
		return(
			<TextNodesEditor
				textNodesUrn={textNodesUrn} />
		);
	}
}

export default TextNodesEditorContainer;