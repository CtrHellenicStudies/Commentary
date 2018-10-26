import React from 'react';
import { compose } from 'react-apollo';
import Select from 'react-select';
import autoBind from 'react-autobind';

import textSelectorQuery from '../../../../settings/graphql/queries/textSelector';


class _WorkInput extends React.Component {
	constructor(props) {
		super(props);

		autoBind(this);
	}

	getCollectionOptions() {
		const { textSelectorQuery } = this.props;
		const collectionOptions = [];
		let collections = [];

		if (
			textSelectorQuery
			&& textSelectorQuery.collections
		) {
			collections = textSelectorQuery.collections;
		}

		collections.forEach(collection => {
			collectionOptions.push({
				value: collection.id,
				label: collection.title,
			});
		});

		return collectionOptions;
	}

	getTextGroupOptions() {
		const { textSelectorQuery } = this.props;
		const textGroupOptions = [];
		let textGroups = [];

		if (
			textSelectorQuery
			&& textSelectorQuery.collection
			&& textSelectorQuery.collection.textGroups
		) {
			textGroups = textSelectorQuery.collection.textGroups;
		}

		textGroups.forEach(textGroup => {
			textGroupOptions.push({
				value: textGroup.urn,
				label: textGroup.title,
			});
		});

		return textGroupOptions;
	}

	getWorkOptions() {
		const { textSelectorQuery } = this.props;
		const workOptions = [];
		let textGroups = [];
		let works = [];

		if (
			textSelectorQuery
			&& textSelectorQuery.collection
			&& textSelectorQuery.collection.textGroups
		) {
			textGroups = textSelectorQuery.collection.textGroups;
		}

		textGroups.forEach(textGroup => {
			if (textGroup.works) {
				works = works.concat(textGroup.works);
			}
		});

		works.forEach(work => {
			workOptions.push({
				value: work.urn,
				label: work.english_title,
			});
		});

		return workOptions;
	}


	render () {
		const { collectionId, textGroupUrn, workUrn } = this.props;

		return (
			<div className="workInput">
				<div className="workSelectorInput">
					<label>Collection</label>
					<Select
						value={collectionId}
						onChange={this.props.handleSelectCollection}
						options={this.getCollectionOptions()}
					/>
				</div>

				<div className="workSelectorInput">
					<label>Text group</label>
					<Select
						floatingLabelText="Select Text Group."
						value={textGroupUrn}
						onChange={this.props.handleSelectTextGroup}
						options={this.getTextGroupOptions()}
						disabled={!(collectionId)}
					/>
				</div>

				<div className="workSelectorInput">
					<label>Work</label>
					<Select
						floatingLabelText="Select Work."
						value={workUrn}
						onChange={this.props.handleSelectWork}
						options={this.getWorkOptions()}
						disabled={!(textGroupUrn)}
					/>
				</div>
			</div>
		);
	}
}

const WorkInput = compose(
	textSelectorQuery,
)(_WorkInput);


class WorkInputContainer extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			collectionId: 3,
			textGroupUrn: "urn:cts:greekLit:tlg0012",
			workUrn: null,
		};

		autoBind(this);
	}

	handleSelectCollection(collectionOption) {
		if (collectionOption) {
			this.setState({ collectionId: collectionOption.value });
		} else {
			this.setState({ collectionId: null });
		}
	}

	handleSelectTextGroup(textGroupOption) {
		if (textGroupOption) {
			this.setState({ textGroupUrn: textGroupOption.value });
		} else {
			this.setState({ textGroupUrn: null });
		}
	}

	handleSelectWork(workOption) {
		if (workOption) {
			this.setState({ workUrn: workOption.value });
		} else {
			this.setState({ workUrn: null });
		}
	}

	render() {
		const { collectionId, textGroupUrn, workUrn } = this.state;

		return (
			<WorkInput
				handleSelectCollection={this.handleSelectCollection}
				handleSelectTextGroup={this.handleSelectTextGroup}
				handleSelectWork={this.handleSelectWork}
				collectionId={collectionId}
				textGroupUrn={textGroupUrn}
				workUrn={workUrn}
			/>
		);
	}
}

export default WorkInputContainer;
