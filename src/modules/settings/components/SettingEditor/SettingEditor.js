import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import autoBind from 'react-autobind';

import { required, maxLength } from '../../../../lib/formHelpers';

import Modal from '../../../../components/common/modal/Modal';
import WorkSearchContainer from '../../../search/containers/WorkSearchContainer';
import CommentaryWorksContainer from '../../containers/CommentaryWorksContainer';

import './SettingEditor.css';

const maxLength200 = maxLength(200);


class SettingEditor extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showWorkSelectorModal: false,
		};
		autoBind(this);
	}

	handleSelectWork(work) {
		this.setState({
			showWorkSelectorModal: false,
		});
		this.props.handleSelectWork(work);
	}

	toggleWorkSelectorModal()  {
		this.setState({
			showWorkSelectorModal: !this.state.showWorkSelectorModal,
		});
	}

	render() {
		const { works } = this.props;
		const { showWorkSelectorModal } = this.state;

		return (
			<div className="settingsEditor">
				<h1>Settings</h1>

				<form
					className="chsForm settingsEditorForm"
					onSubmit={this.props.handleSubmit}
				>

					<div className="chsFormInputOuter settingsFormInputOuter">
						<label>
							What is your Commentary&apos;s title?
						</label>
						<Field
							name="title"
							type="text"
							component="input"
							placeholder="Your Commentary&apos;s title . . ."
							validate={[required, maxLength200]}
						/>
					</div>

					<div className="chsFormInputOuter settingsFormInputOuter">
						<label>
							What is your Commentary&apos;s subtitle?
						</label>
						<Field
							name="subtitle"
							component="textarea"
							placeholder="Your Commentary&apos;s subtitle . . ."
							validate={[required, maxLength200]}
						/>
					</div>

					<div className="chsFormInputOuter settingsFormInputOuter">
						<label>
							Manage works included in this Commentary
						</label>
						<CommentaryWorksContainer
							works={works}
							toggleWorkSelectorModal={this.toggleWorkSelectorModal}
							handleSelectWork={this.handleSelectWork}
						/>
					</div>
					<button
						type="submit"
						className={`
							chsFormButton settingsEditorButton
						`}
					>
						Save
					</button>
				</form>

				<Modal
					show={showWorkSelectorModal}
					closeModal={this.toggleWorkSelectorModal}
					innerFullWidth
				>
					<div>
						<h3>
							Select works for this Commentary
						</h3>
						<WorkSearchContainer
							handleSelectWork={this.handleSelectWork}
						/>
					</div>
				</Modal>
			</div>
		);
	}
}

SettingEditor.propTypes = {
	setting: PropTypes.object,
};

SettingEditor.defaultProps = {
	setting: null,
};

export default reduxForm({
	form: 'SettingEditor',
})(SettingEditor);
