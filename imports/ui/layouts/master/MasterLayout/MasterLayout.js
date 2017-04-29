import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import 'mdi/css/materialdesignicons.css';

// layouts
import Header from '/imports/ui/layouts/header/Header';
import Footer from '/imports/ui/components/footer/Footer';

const MasterLayout = React.createClass({

	propTypes: {
		content: React.PropTypes.object,
	},

	render() {
		return (
			<MuiThemeProvider>
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
