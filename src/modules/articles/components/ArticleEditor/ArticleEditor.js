import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { withRouter } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import _s from 'underscore.string';

// component
import ArticleTextEditor from '../ArticleTextEditor';
import DeleteModal from './DeleteModal';
import OptionsPanel from './OptionsPanel';

// lib
import { maxlength } from '../../../../lib/formhelpers';

// redux
import { setCategoryType } from '../../actions';


import './ArticleEditor.css';


const maxLength2000 = maxLength(2000);



class ArticleEditor extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showOptionView: false,
			text: '',
			deleteModalOpen: false,
		};

		autoBind(this);
	}

	handleChange(value) {
		this.setState({
			text: value
		});
	}

	toggleOptionView() {
		this.setState({
			showOptionView: !this.state.showOptionView
		});
	}

	toggleDeleteModal() {
		this.setState({
			deleteModalOpen: !this.state.deleteModalOpen
		});
	}

	closeDeleteModal() {
		this.setState({
			deleteModalOpen: false,
		});
	}

	render() {
		return (
			<div className="articleEditor">
					{this.state.showOptionView ?
						<OptionsPanel
							categoryType={this.props.categoryType}
							toggleDeleteModal={this.toggleDeleteModal}
						/>
					: ''}

					<div className="createArticleContainer">
						<div className="articleEditorFormInputOuter articleEditorFormTitleOuter">
							<Field
								name="title"
								type="text"
								className="articleTitleInput"
								component="textarea"
								placeholder={`Title of the ${(
									this.props.categoryType === 'theme' ?
									'Theme'
								:
									`${_s(this.props.categoryType).capitalize()._wrapped} article`
									)}. . .`}
								validate={[maxLength2000]}
								required
							/>
						</div>
					</div>

					<DeleteModal
						deleteModalOpen={this.state.deleteModalOpen}
						closeDeleteModal={this.closeDeleteModal}
						handleRemove={this.props.handleRemove}
					/>

				{/** Article text editor must be outside of form to prevent wrongful submits on button clicks */}
				<ArticleTextEditor
					editorState={this.props.editorState}
					config={{
						data_storage: {
							url: '/articles/x',
							method: 'POST',
							success_handler: null,
							failure_handler: null,
							interval: 500,
							save_handler: this.props.handleEditorChange
						}
					}}
				/>
			</div>
		);
	}
}


ArticleEditor.propTypes = {
	article: PropTypes.object,
	files: PropTypes.array,
	metadata: PropTypes.array,
	categoryType: PropTypes.string,
};

ArticleEditor.propTypes = {
	article: PropTypes.object,
	files: PropTypes.array,
	metadata: PropTypes.array,
	categoryType: PropTypes.string,
};

ArticleEditor.defaultProps = {
	categoryType: 'archive'
}

const mapStateToProps = state => ({
	categoryType: state.articleEditor.categoryType,
});

const mapDispatchToProps = dispatch => ({
	dispatchSetCategoryType: (type) => {
		dispatch(setCategoryType(type));
	},
});

let EditorForm = reduxForm({
	form: 'ArticleEditor',
	enableReinitialize: true,
})(ArticleEditor);

export default compose(
	withRouter,
	connect(mapStateToProps, mapDispatchToProps)
)(EditorForm);
