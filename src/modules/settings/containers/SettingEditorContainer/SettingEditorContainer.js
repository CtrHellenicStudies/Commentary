import React from 'react';
import { compose } from 'react-apollo';
import autoBind from 'react-autobind';

import SettingEditor from '../../components/SettingEditor';
import tenantBySubdomainQuery from '../../../tenants/graphql/queries/tenantBySubdomain';
import settingCreateMutation from '../../graphql/mutations/create';
import settingUpdateMutation from '../../graphql/mutations/update';
import settingRemoveMutation from '../../graphql/mutations/remove';


class SettingEditorContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			works: [],
		};
		autoBind(this);
	}

	handleSelectWork(work) {
		const { works } = this.state;

		if (works.some(w => ( w.id === work.id ))) {
			works.forEach((w, i) => {
				if (w.id === work.id) {
					works.splice(i, 1);
				}
			})
		} else {
			works.push(work);
		}

		this.setState({
			works,
		});
	}

	handleSubmit(_values) {
		const values = {}; // Object.assign({}, _values);
		const { settingCreate, settingUpdate, router } = this.props;
		const { collection, textGroup, work } = this.state;


		values.ctsNamespace = collection;
		values.textGroup = textGroup;
		values.work = work;
		// remove unused values
		delete values.__typename;

		// create or update
		if ('_id' in _values) {
			values._id = _values._id;
			settingUpdate(values)
				.then((response) => {
					router.replace(`/settings/${values._id}`);
				})
				.catch((err) => {
					console.error(err);
				});
		} else {
			settingCreate(values)
				.then((response) => {
					router.replace('/settings/');
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}

	render() {
		const { works } = this.state;

		// Get text from query
		let settings;
		if (
			this.props.tenantQuery
			&& this.props.tenantQuery.tenantBySubdomain
		) {
			settings = this.props.tenantQuery.tenantBySubdomain.settings;
		}

		return (
			<SettingEditor
				onSubmit={this.handleSubmit}
				onRemove={this.handleRemove}
				initialValues={settings}
				handleSelectWork={this.handleSelectWork}
				works={works}
			/>
		);
	}
}

export default compose(
	tenantBySubdomainQuery, settingCreateMutation, settingUpdateMutation,
	settingRemoveMutation,
)(SettingEditorContainer);
