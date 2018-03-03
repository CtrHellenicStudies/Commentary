import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { required, maxLength } from '../../../../lib/formHelpers';
import TextSelectorContainer from '../../containers/TextSelectorContainer';


const maxLength200 = maxLength(200);



class SettingEditor extends React.Component {

	render() {
		const { collection, settingGroup, work } = this.props;

		return (
			<div className="settingEditor">

				<h1>Configure settings for this commentary</h1>

				<form
					className="chsForm settingEditorForm"
					onSubmit={this.props.handleSubmit}
				>

					<div className="chsFormInputOuter settingFormInputOuter">
						<label>What is your Commentary&apos;s title?</label>
						<Field
							name="title"
							type="text"
							component="input"
							placeholder="Your Commentary&apos;s title . . ."
							validate={[required, maxLength200]}
						/>
						<span
							className="chsFormHelp settingsFormHelp"
						>
							?
						</span>
					</div>

					<div className="chsFormInputOuter settingsFormInputOuter">
						<label>What is your Commentary&apos;s subtitle?</label>
						<Field
							name="title"
							type="text"
							component="input"
							placeholder="Your Commentary&apos;s subtitle . . ."
							validate={[required, maxLength200]}
						/>
						<span
							className="chsFormHelp settingsFormHelp"
						>
							?
						</span>
					</div>

					<TextSelectorContainer
						collectionId={collection}
						settingGroupUrn={settingGroup}
						workUrn={work}
						handleSelectCollection={this.props.handleSelectCollection}
						handleSelectSettingGroup={this.props.handleSelectSettingGroup}
						handleSelectWork={this.props.handleSelectWork}
					/>

					<button
						type="submit"
						className={`
							settingEditorButton
						`}
					>
						Save
					</button>
				</form>
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
