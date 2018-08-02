import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import slugify from 'slugify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoBind from 'react-autobind';

// graphql
import keywordInsertMutation from '../../graphql/mutations/insert';

// components
import Header from '../../../../components/navigation/Header';
import FilterWidget from '../../../filters/components/FilterWidget';

// lib
import muiTheme from '../../../../lib/muiTheme';
import PageMeta from '../../../../lib/pageMeta';
import userInRole from '../../../../lib/userInRole';
import AddKeywordContainer from '../../containers/AddKeywordContainer';


class AddKeywordLayout extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedLineFrom: 0,
			selectedLineTo: 0,
			selectedType: 'word',
			contextReaderOpen: true,
			loading: false,
			selectedTextNodes: [],
		};

		autoBind(this);
	}

	componentWillUpdate() {
		this.handlePermissions();
	}

	getSelectedLineTo() {
		let selectedLineTo = 0;
		if (this.state.selectedLineTo === 0) {
			selectedLineTo = this.state.selectedLineFrom;
		} else {
			selectedLineTo = this.state.selectedLineTo;
		}
		return selectedLineTo;
	}

	getType() {
		return this.state.selectedType;
	}

	async addKeyword(formData, textValue, textRawValue) {
		this.setState({
			loading: true,
		});

		// get data for keyword :
		// create keyword object to be inserted:
		const keyword = {
			title: formData.titleValue,
			slug: slugify(formData.titleValue.toLowerCase()),
			description: textValue,
			descriptionRaw: JSON.stringify(textRawValue),
			type: this.state.selectedType,
			count: 1,
			tenantId: this.props.tenantId,
		};

		await this.props.keywordInsert(keyword);
		this.props.history.push(`/tags/${keyword.slug}`);
	}

	componentWillUnmount() {
		if (this.timeout)	{ clearTimeout(this.timeout); }
	}

	onTypeChange(type) {
		this.setState({
			selectedType: type,
		});
	}

	handlePermissions() {
		if (!userInRole(Cookies.get('user'), ['editor', 'admin', 'commenter'])) {
			this.props.history.push('/');
		}
	}

	lineLetterUpdate(value) {
		this.setState({
			lineLetter: value,
		});
	}

	render() {
		const textNodesUrn = 'urn:cts:greekLit:tlg0012.tlg001';

		PageMeta.setTitle('Add Tag | The Center for Hellenic Studies Commentaries');

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="chs-layout chs-editor-layout add-comment-layout">
					<div>
						<Header
							initialSearchEnabled
						/>

						<main>
							<AddKeywordContainer
								textNodesUrn={textNodesUrn}
								addKeyword={this.addKeyword}
							/>
							<FilterWidget />
						</main>
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}

AddKeywordLayout.propTypes = {
	history: PropTypes.object,
	keywordInsert: PropTypes.func,
};

AddKeywordLayout.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	keywordInsertMutation,
)(AddKeywordLayout);
