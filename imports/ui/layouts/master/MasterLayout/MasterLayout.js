import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// layouts
import Header from '/imports/ui/layouts/header/Header';
import Footer from '/imports/ui/components/footer/Footer';

// lib
import muiTheme from '/imports/lib/muiTheme';


class MasterLayout extends React.Component {

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
	}
}


MasterLayout.propTypes = {
	content: PropTypes.object,
};

export default MasterLayout;
