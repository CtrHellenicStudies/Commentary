import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';


import TextSelectorContainer from '../../containers/TextSelectorContainer';


//import './SettingEditor.css';


class SettingEditor extends React.Component {

	render() {
		const { setting, collection, settingGroup, work } = this.props;

		return (
			<div className="settingEditor">

				<h1>Configure texts included in this commentary</h1>

				<form
					className="settingEditorForm"
					onSubmit={this.props.handleSubmit}
				>

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
