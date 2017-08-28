import React from 'react';


class TextNodesEditorLayout extends React.Component {
	render() {
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<ApolloProvider
					client={client}
					store={store}
				>
					<div className="chs-layout chs-editor-layout add-comment-layout">
					</div>
				</ApolloProvider>
			</MuiThemeProvider>
		);
	}
}

export default TextNodesEditorLayout;
