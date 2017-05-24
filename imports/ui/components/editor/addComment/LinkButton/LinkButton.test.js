import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component:
import LinkButton from './LinkButton';


describe('LinkButton', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<LinkButton
						getEditorState={() => ({
							getCurrentContent: () => ({
								getEntity: () => ({
									data: {
										link: 'http://test.url',
									},
								}),
								getBlockForKey: () => ({
									getEntityAt: () => ({}),
								}),
							}),
							getSelection: () => ({
								isCollapsed: () => false,
								getStartKey: () => ({}),
								getStartOffset: () => ({}),
							}),
						})}
						setEditorState={() => {}}
						theme={{
							button: 'test',
							active: 'test',
							buttonWrapper: {},
						}}
					/>
				</MuiThemeProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
