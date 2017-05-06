import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import 'mdi/css/materialdesignicons.css';

// layouts
import Header from '/imports/ui/layouts/header/Header';
import Footer from '/imports/ui/components/footer/Footer';

// lib
import muiTheme from '/imports/lib/muiTheme';


const MasterLayout = React.createClass({

	propTypes: {
		content: React.PropTypes.object,
	},

	render() {
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="chs-layout master-layout">
					<Header />
					<main>
						{this.props.content}
					</main>
					<Footer />
				</div>
			</MuiThemeProvider>
		);
	},
});


export default MasterLayout;
