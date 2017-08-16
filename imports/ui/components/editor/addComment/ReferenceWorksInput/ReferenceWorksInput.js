import React from 'react';

const ReferenceWorksInput = props => {

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
										<FormsyText
											name={`${i}_section`}
											defaultValue={referenceWork.section}
										/>
									</FormGroup>
									<FormGroup>
										<ControlLabel>Chapter Number: </ControlLabel>
										<FormsyText
											name={`${i}_chapter`}
											defaultValue={referenceWork.chapter}
										/>
									</FormGroup>
									<FormGroup>
										<ControlLabel>Translation Number: </ControlLabel>
										<FormsyText
											name={`${i}_translation`}
											defaultValue={referenceWork.translation}
										/>
									</FormGroup>
									<FormGroup>
										<ControlLabel>Note Number: </ControlLabel>
										<FormsyText
											name={`${i}_note`}
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

export default ReferenceWorksInput;
