import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import _s from 'underscore.string';

// graphql
import settingsQuery from '../../../settings/graphql/queries/list';

// components
import BackgroundImageHolder from '../../../shared/components/BackgroundImageHolder';
import LoadingPage from '../../../../components/loading/LoadingPage';
import KeywordListContainer from '../../containers/KeywordListContainer';
import Header from '../../../../components/navigation/Header';

// lib
import PageMeta from '../../../../lib/pageMeta';
import muiTheme from '../../../../lib/muiTheme';


class KeywordPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			portion: 20,
			limit: 1
		};
	}

	raiseLimit() {
		this.setState({
			limit: this.state.limit + 1
		});
	}

	componentWillReceiveProps(props) {
		const { tenantId } = this.props;
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
			PageMeta.setTitle(`Words | ${settings.title}`);
		} else {
			PageMeta.setTitle(`Ideas | ${settings.title}`);
		}
		PageMeta.setDescription(`${_s.capitalize(this.props.type)} for ${settings.title}`);
		PageMeta.setMetaImage(`${window.location.origin}/images/apotheosis_homer.jpg`);

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
							<KeywordListContainer
								type={type}
								limit={this.state.limit * this.state.portion}
								queryParam={JSON.stringify({ type })}
							/>
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

KeywordPage.propTypes = {
	type: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	settingsQuery: PropTypes.object,
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	settingsQuery,
)(KeywordPage);
