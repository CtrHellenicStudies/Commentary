import React from 'react';
import renderer from 'react-test-renderer';

// component:
import ContextPanelText from './ContextPanelText';

describe('ContextPanelText', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<ContextPanelText
				lineFrom=""
				lineTo=""
				onBeforeClicked=""
				onAfterClicked=""
				selectedLemmaEdition=""
				lemmaText=""
				maxLine=""
			/>)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
