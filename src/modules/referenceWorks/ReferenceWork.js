import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import randomID from 'random-id';
import { FormsyText } from 'formsy-material-ui/lib';
import {
	FormGroup,
	ControlLabel,
} from 'react-bootstrap';
import Select from 'react-select';
import update from 'immutability-helper';

// components
import { ListGroupDnD, createListGroupItemDnD } from '../shared/listDnD/ListDnD';



const ListGroupItemDnD = createListGroupItemDnD('referenceWorkBlocks');

/*
 *	BEGIN AddComment
 */
export default class ReferenceWork extends Component {

	constructor(props) {
		super(props);
		if (this.props.referenceWorks) {
			this.state = {
				referenceWorks: JSON.parse(JSON.stringify(this.props.referenceWorks)),
			};
		} else {
			this.state = {
				referenceWorks: []
			};
		}

		// methods:
		this.addReferenceWorkBlock = this.addReferenceWorkBlock.bind(this);
		this.removeReferenceWorkBlock = this.removeReferenceWorkBlock.bind(this);
		this.moveReferenceWorkBlock = this.moveReferenceWorkBlock.bind(this);
		this.changeChapter = this.changeChapter.bind(this);
		this.changeNote = this.changeNote.bind(this);
		this.changeSection = this.changeSection.bind(this);
		this.changeTranslation = this.changeTranslation.bind(this);
	}
	componentWillReceiveProps(newProps) {
		if (newProps.referenceWorks) { 
			this.setState({referenceWorks: JSON.parse(JSON.stringify(newProps.referenceWorks))}); 
		}
	}
	changeNote(event, value, i) {
		const _referenceWorks = this.state.referenceWorks;
		_referenceWorks[i].note = value;
		this.setState({
			referenceWorks: _referenceWorks
		});
		this.props.update(_referenceWorks);
	}
	changeSection(event, value, i) {
		const _referenceWorks = this.state.referenceWorks;
		_referenceWorks[i].section = value;
		this.setState({
			referenceWorks: _referenceWorks
		});
		this.props.update(_referenceWorks);
	}
	changeTranslation(event, value, i) {
		const _referenceWorks = this.state.referenceWorks;
		_referenceWorks[i].translation = value;
		this.setState({
			referenceWorks: _referenceWorks
		});
		this.props.update(_referenceWorks);
	}
	changeChapter(event, value, i) {
		const _referenceWorks = this.state.referenceWorks;
		_referenceWorks[i].chapter = value;
		this.setState({
			referenceWorks: _referenceWorks
		});
		this.props.update(_referenceWorks);
	}
	onReferenceWorksValueChange(referenceWork, i) {
		const referenceWorks = this.state.referenceWorks;
		if (referenceWork) {
			referenceWorks[i].referenceWorkId = referenceWork.value;
		} else {
			referenceWorks[i].referenceWorkId = undefined;
		}
		this.setState({
			referenceWorks
		});
		this.props.update(referenceWorks);

	}
	addReferenceWorkBlock() {
		this.state.referenceWorks.push({ referenceWorkId: randomID(20) });
		this.props.update(this.state.referenceWorks);
	}

	removeReferenceWorkBlock(i) {
		const _referenceWorks = update(this.state.referenceWorks, { $splice: [[i, 1]] });
		this.props.update(_referenceWorks);
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
		this.props.update(this.state.referenceWorks);
	}
	render() {
		const { referenceWorks } = this.state;
		const { referenceWorkOptions } = this.props;
		if (!this.props.ready) {
			return null;
		}
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
									type: rW.type,
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
												iconClassName="material-icons"
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
											>close</IconButton>
										</div>
										<Select.Creatable
											name="referenceWorks"
											id="referenceWorks"
											required={false}
											options={_referenceWorkOptions}
											value={this.state.referenceWorks[i].referenceWorkId}
											onChange={(x) => this.onReferenceWorksValueChange(x, i)}
											placeholder="Reference Work . . ."
											onNewOptionClick={this.props.addNew}
										/>
										<FormGroup>
											<ControlLabel>Section Number: </ControlLabel>
											<FormsyText
												name={`${i}_section`}
												value={this.state.referenceWorks[i].section}
												onChange={(x, y) => this.changeSection(x, y, i)}
											/>
										</FormGroup>
										<FormGroup>
											<ControlLabel>Chapter Number: </ControlLabel>
											<FormsyText
												name={`${i}_chapter`}
												value={this.state.referenceWorks[i].chapter}
												onChange={(x, y) => this.changeChapter(x, y, i)}
											/>
										</FormGroup>
										<FormGroup>
											<ControlLabel>Translation Number: </ControlLabel>
											<FormsyText
												name={`${i}_translation`}
												value={this.state.referenceWorks[i].translation}
												onChange={(x, y) => this.changeTranslation(x, y, i)}
											/>
										</FormGroup>
										<FormGroup>
											<ControlLabel>Note Number: </ControlLabel>
											<FormsyText
												name={`${i}_note`}
												value={this.state.referenceWorks[i].note}
												onChange={(x, y) => this.changeNote(x, y, i)}
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
ReferenceWork.propTypes = {
	referenceWorkOptions: PropTypes.array,
	referenceWorks: PropTypes.array,
	update: PropTypes.func,
	ready: PropTypes.bool,
	addNew: PropTypes.func
};
ReferenceWork.defaultProps = {
	selectedLineFrom: null,
	referenceWorkOptions: [],
};

