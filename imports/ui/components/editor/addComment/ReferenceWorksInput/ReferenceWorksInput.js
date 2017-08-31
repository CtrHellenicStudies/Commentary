import React from 'react';
import Formsy from 'formsy-react';
import { Field } from 'redux-form'
import { createContainer } from 'meteor/react-meteor-data';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
import {
	FormGroup,
	ControlLabel,
} from 'react-bootstrap';
import Select from 'react-select';
import { Creatable } from 'react-select';

// models
import ReferenceWorks from '/imports/models/referenceWorks';

// components
import { ListGroupDnD, createListGroupItemDnD } from '/imports/ui/components/shared/ListDnD';

const ListGroupItemDnD = createListGroupItemDnD('referenceWorkBlocks');

class ReferenceWorksInput extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			referenceWorks: [],
		};

		this.addReferenceWorkBlock = this.addReferenceWorkBlock.bind(this);
		this.removeReferenceWorkBlock = this.removeReferenceWorkBlock.bind(this);
		this.moveReferenceWorkBlock = this.moveReferenceWorkBlock.bind(this);
	}

	addReferenceWorkBlock() {
		this.state.referenceWorks.push({ referenceWorkId: Random.id() });
		this.setState({
			referenceWorks: this.state.referenceWorks,
		});
	}

	removeReferenceWorkBlock(i) {
		this.setState({
			referenceWorks: update(this.state.referenceWorks, { $splice: [[i, 1]] }),
		});
	}

	moveReferenceWorkBlock(dragIndex, hoverIndex) {
		const { referenceWorks } = this.state;
		const dragIntroBlock = referenceWorks[dragIndex];

		this.setState(update(this.state, {
			referenceWorks: {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragIntroBlock],
				],
			},
		}));
	}

	render() {
		const { referenceWorks } = this.state;
		const { referenceWorkOptions } = this.props;

		return (
			<div className="comment-reference">
				<h4>Secondary Source(s):</h4>
				<FormGroup
					controlId="referenceWorks"
					className="form-group--referenceWorks"
				>
					<ListGroupDnD>
						{/*
							DnD: add the ListGroupItemDnD component
							IMPORTANT:
							"key" prop must not be taken from the map function - has to be unique like _id
							value passed to the "key" prop must not be then edited in a FormControl component
								- will cause errors
							"index" - pass the map functions index variable here
						*/}
						{referenceWorks.map((referenceWork, i) => {
							const _referenceWorkOptions = [];
							referenceWorkOptions.forEach((rW) => {
								_referenceWorkOptions.push({
									value: rW.value,
									label: rW.label,
									slug: rW.slug,
									i,
								});
							});

							return (
								<ListGroupItemDnD
									key={referenceWork.referenceWorkId}
									index={i}
									className="form-subitem form-subitem--referenceWork"
									moveListGroupItem={this.moveReferenceWorkBlock}
								>
									<div
										className="reference-work-item"
									>
										<div
											className="remove-reference-work-item"
											onClick={this.removeReferenceWorkBlock.bind(this, i)}
										>
											<IconButton
												iconClassName="mdi mdi-close"
												style={{
													padding: '0',
													width: '32px',
													height: '32px',
													borderRadius: '100%',
													border: '1px solid #eee',
													color: '#666',
													margin: '0 auto',
													background: '#f6f6f6',
												}}
											/>
										</div>
										<Creatable
											name="referenceWorks"
											id="referenceWorks"
											required={false}
											options={_referenceWorkOptions}
											value={this.state.referenceWorks[i].referenceWorkId}
											// onChange={this.onReferenceWorksValueChange.bind(this, referenceWork, i)}
											onChange={this.onReferenceWorksValueChange}
											placeholder="Reference Work . . ."
										/>
										<FormGroup>
											<ControlLabel>Section Number: </ControlLabel>
											<Field
												name={`${i}_section`}
												component="input"
												defaultValue={referenceWork.section}
											/>
										</FormGroup>
										<FormGroup>
											<ControlLabel>Chapter Number: </ControlLabel>
											<Field
												name={`${i}_chapter`}
												component="input"
												defaultValue={referenceWork.chapter}
											/>
										</FormGroup>
										<FormGroup>
											<ControlLabel>Translation Number: </ControlLabel>
											<Field
												name={`${i}_translation`}
												component="input"
												defaultValue={referenceWork.translation}
											/>
										</FormGroup>
										<FormGroup>
											<ControlLabel>Note Number: </ControlLabel>
											<Field
												name={`${i}_note`}
												component="input"
												defaultValue={referenceWork.note}
											/>
										</FormGroup>
									</div>
								</ListGroupItemDnD>
							);
						})}
					</ListGroupDnD>
					<RaisedButton
						label="Add Reference Work"
						onClick={this.addReferenceWorkBlock}
					/>
				</FormGroup>
			</div>
		);
	}
}

const ReferenceWorksInputContainer = createContainer(() => {

	Meteor.subscribe('referenceWorks', Session.get('tenantId'));
	const referenceWorks = ReferenceWorks.find().fetch();
	const referenceWorkOptions = [];
	referenceWorks.forEach((referenceWork) => {
		if (!referenceWorkOptions.some(val => (
			referenceWork.slug === val.slug
		))) {
			referenceWorkOptions.push({
				value: referenceWork._id,
				label: referenceWork.title,
				slug: referenceWork.slug,
			});
		}
	});

	return {
		referenceWorkOptions,
	};

}, ReferenceWorksInput);


export default ReferenceWorksInputContainer;