import React from 'react';
import renderer from 'react-test-renderer';

// component:
import ContextPanelTabs from './ContextPanelTabs';

describe('ContextPanelTabs', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<ContextPanelTabs
				lemmaText={[]}
				selectedLemmaEdition=""
				toggleEdition={() => {}}
				toggleHighlighting={() => {}}
				highlightingVisible={false}
			/>)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix error:
// Warning: Failed context type: The context `muiTheme` is marked as required in `RaisedButton`, but its value is `undefined`.
// 	in RaisedButton (created by MetaTabs)
// in div (created by MetaTabs)
// in MetaTabs (created by ContextPanelTabs)
// in div (created by ContextPanelTabs)
// in ContextPanelTabs

