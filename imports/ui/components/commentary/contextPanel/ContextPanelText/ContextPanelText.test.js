import React from 'react';
import renderer from 'react-test-renderer';

// component:
import ContextPanelText from './ContextPanelText';

describe('ContextPanelText', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<ContextPanelText
				lineFrom={1}
				onBeforeClicked={() => {}}
				onAfterClicked={() => {}}
				selectedLemmaEdition="test"
				lemmaText={[]}
			/>)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
