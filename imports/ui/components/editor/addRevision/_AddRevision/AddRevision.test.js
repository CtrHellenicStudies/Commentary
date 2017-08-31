import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component
import AddRevision from './AddRevision';

describe('AddRevision', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<AddRevision
						submitForm={() => {}}
						update={() => {}}
						comment={{
							revisions: [{
								title: 'testComment',
								text: 'test comment text',
							}],
						}}
					/>
				</MuiThemeProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix TypeError: Cannot read property 'split' of undefined (draft.js?)
