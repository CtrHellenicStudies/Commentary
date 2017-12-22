import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';

// lib
import Utils from '/imports/lib/utils';
import RaisedButton from 'material-ui/RaisedButton';

// graphql
import { settingsQuery } from '/imports/graphql/methods/settings';

// models
import Settings from '/imports/models/settings';
import { Link } from 'react-router-dom';

// components
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import LoadingPage from '/imports/ui/components/loading/LoadingPage';
import KeywordsList from '/imports/ui/components/keywords/KeywordsList';
import muiTheme from '/imports/lib/muiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from '/imports/ui/layouts/header/Header';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


class KeywordsPage extends Component {

	static propTypes = {
		type: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		settingsQuery: PropTypes.object,
	};
	raiseLimit() {
		this.setState({
			limit: this.state.limit + 1
		});
	}
	constructor(props) {
		super(props);
		this.state = {
			portion: 20,
			limit: 1
		};
	}
	componentWillReceiveProps(props) {
		const tenantId = sessionStorage.getItem('tenantId');
		this.setState({
			settings: props.settingsQuery.loading ? { title: '' } : props.settingsQuery.settings.find(x => x.tenantId === tenantId)
		});
	}
	render() {
		const { title, type} = this.props;
		const { settings } = this.state;

		if (!settings) {
			return <LoadingPage />;
		}

		if (type === 'word') {
			Utils.setTitle(`Words | ${settings.title}`);
		} else {
			Utils.setTitle(`Ideas | ${settings.title}`);
		}
		Utils.setDescription(`${Utils.capitalize(this.props.type)} for ${settings.title}`);
		Utils.setMetaImage(`${location.origin}/images/apotheosis_homer.jpg`);

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="page keywords-page">
					<Header />
					<div className="content primary">
						<section className="block header header-page cover parallax">
							<BackgroundImageHolder
								imgSrc="/images/apotheosis_homer.jpg"
							/>

							<div className="container v-align-transform">
								<div className="grid inner">
									<div className="center-content">
										<div className="page-title-wrap">
											<h2 className="page-title ">{title}</h2>
										</div>
									</div>
								</div>
							</div>
						</section>

						<section className="page-content">
							<KeywordsList type={type} limit={this.state.limit * this.state.portion} />
							<div className="read-more-link">
								<RaisedButton
									onClick={this.raiseLimit.bind(this)}
									className="cover-link show-more "
									label="Read More"
								/>
							</div>
						</section>
					</div>
				</div>
			</MuiThemeProvider>
		);
	}

}

export default compose(settingsQuery)(KeywordsPage);
