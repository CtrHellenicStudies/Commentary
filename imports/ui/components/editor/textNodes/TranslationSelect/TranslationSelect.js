import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {
	ControlLabel,
	FormGroup,
} from 'react-bootstrap';
import Select from 'react-select';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

import TranslationNodes from '/imports/models/translationNodes';


class TranslationSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTranslation: null,
		};
		this.selectTranslation = this.selectTranslation.bind(this);
	}

	selectTranslation(event) {
		const setValue = event ? event.value : '';
		this.setState({
			selectedTranslation: setValue
		});
	}

	render() {
		const { selectedTranslation } = this.state;

		const translationOptions = [];
		this.props.translationOptions.map(translation => {
			translationOptions.push({
				value: translation,
				label: translation,
			});
		});

		return (
			<div className="text-nodes-editor-meta-input translation-input">
				<FormGroup controlId="formControlsSelect">
					<ControlLabel>Translation</ControlLabel>
					<Select
						name="subwork-select"
						value={selectedTranslation}
						options={translationOptions}
						onChange={this.selectTranslation}
					/>
				</FormGroup>
			</div>
		);
	}
}

const TranslationSelectContainer = createContainer(props => {
	const translationOptions = Session.get('translationOptions');

	if (props.selectedWork && props.selectedSubwork) {
		Meteor.call('translationNodes.getAuthors', Session.get('tenantId'), props.selectedWork, props.selectedSubwork, (err, result) => {
			if (!err) {
				Session.set('translationOptions', result);
			}		else {
				throw new Error(err);
			}
		});
	}

	return {
		translationOptions,
	};

}, TranslationSelect);

export default TranslationSelectContainer;
