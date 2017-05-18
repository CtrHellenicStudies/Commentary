import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component:
import ContextPanelTabs from './ContextPanelTabs';

describe('ContextPanelTabs', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<ContextPanelTabs
						lemmaText={[]}
						selectedLemmaEdition=""
						toggleEdition={() => {}}
						toggleHighlighting={() => {}}
						highlightingVisible={false}
					/>
				</MuiThemeProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});


