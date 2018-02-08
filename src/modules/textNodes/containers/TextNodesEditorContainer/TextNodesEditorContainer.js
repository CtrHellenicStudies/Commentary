import React, { Component } from 'react';

// graphql
import { editionsQuery } from '../../../../graphql/methods/editions';

// components
import TextNodesEditor from '../../components/TextNodesEditor/TextNodesEditor';

const TextNodesEditorContainer = class TextNodesEditorContainerClass extends Component {
    
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