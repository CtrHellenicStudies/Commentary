import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// component:
import { Link } from './linkDecorator';

describe('linkDecarator', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<MuiThemeProvider>
					<Link
						contentState={{
							getEntity: () => ({
								getData: () => ({
									url: 'http://test.url'
								}),
							}),
						}}
					/>
				</MuiThemeProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
