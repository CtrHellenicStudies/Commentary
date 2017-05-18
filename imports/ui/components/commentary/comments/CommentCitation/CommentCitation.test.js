import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component:
import CommentCitation from './CommentCitation';

describe('CommentCitation', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<CommentCitation
						commentId="testId"
						revisions={[]}
					/>
				</MuiThemeProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix Invariant Violation: CommentCitation.getChildContext(): childContextTypes must be defined in order to use getChildContext().
// Wrap MuiThemeProvider
