import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component:
import AddCommentForm from './AddCommentForm';

describe('AddCommentForm', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<AddCommentForm
						selectedLineFrom=""
						selectedLineTo=""
						submitForm=""
					/>
				</MuiThemeProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix ReferenceError: ReactMeteorData is not defined
