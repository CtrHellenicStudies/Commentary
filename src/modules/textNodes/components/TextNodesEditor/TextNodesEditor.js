import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import Select from 'react-select';
import autoBind from 'react-autobind';
import {
	ControlLabel,
	FormGroup,
} from 'react-bootstrap';
import TextField from 'material-ui/TextField';

// graphql
import { editionsQuery } from '../../../textNodes/graphql/queries/editions';
import textNodesQuery from '../../graphql/queries/textNodesQuery';

// lib:
import Utils from '../../../../lib/utils';

// components
import TextNodesInput from '../TextNodesInput/TextNodesInput';
import EditWorkDialog from '../EditWorkDialog/EditWorkDialog';
import EditEditionDialog from '../EditEditionDialog/EditEditionDialog';
import EditSubworkDialog from '../EditSubworkDialog/EditSubworkDialog';
import MultilineDialog from '../MultilineDialog/MultilineDialog';
import TranslationSelect from '../TranslationSelect/TranslationSelect';
import TranslationNodeInput from '../TranslationNodeInput/TranslationNodeInput';
import RefsDeclEditor from '../RefsDeclEditor';


import './TextNodesEditor.css';


function isLocation(location) {

	if(!location) {
		return false;
	}
	const cutted = location.split('.');
	let ret = cutted;
	if(cutted.length !== 2) {
		ret = false;
	} else if(isNaN(parseInt(cutted[0], 10)) || isNaN(parseInt(cutted[1], 10))) {
		ret  = false;
	}
	return ret;
}
class TextNodesEditor extends React.Component {
	constructor(props) {
		super(props);

		const selectedWork = null;
		const selectedEdition = null;
		const selectedSubwork = null;
		const selectedTranslation = null;
		const subworks = [];
		const limit = 50;

		this.state = {
			subworks,
			selectedWork,
			selectedEdition,
			selectedSubwork,
			selectedTranslation,
			startAtLocation: undefined,
			endAtLocation: undefined,
			limit,
			works: [],
			editions: [],
			editWorkDialogOpen: false,
			editEditionDialogOpen: false,
			editSubworkDialogOpen: false,
			multiLineDialogOpen: false
		};
		autoBind(this);
	}
	componentWillReceiveProps(props) {
		if (props.editionsQuery.loading || props.textNodesQuery.loading) {
			return;
		}
		const { selectedEdition, selectedWork } = this.state;
		const editions = props.editionsQuery.works;
		const works = Utils.worksFromEditions(editions);
		this.setState({
			works,
			editions,
			textNodes: props.textNodesQuery.textNodes
		});
		if (selectedEdition && selectedWork) {
			this.setState({
				textNodes: props.textNodesQuery.textNodes
			});
		}
	}
	selectWork(event) {
		const setValue = event ? event.value : '';
		const { selectedEdition, startAtLocation, endAtLocation } = this.state;
		const { works } = this.state;
		let editionsAvailable = [];
		let _selectedWork;
		works.forEach(work => {
			if (work.id === setValue) {
				_selectedWork = work;
			}
		});
		this.state.editions.forEach(function(edition) {
			if (edition.urn === _selectedWork.urn) {
				editionsAvailable.push(edition);
			}
		});
		this.setState({
			selectedWork: setValue,
			editionsAvailable: editionsAvailable
		//	subworks: _selectedWork
		});
		const locationFrom = isLocation(startAtLocation);
		const locationTo = isLocation(endAtLocation);
		this.refetchTextNodesQuery(selectedEdition, setValue, locationFrom, locationTo);
	}

	selectEdition(event) {
		const setValue = event ? event.value : '';
		const { selectedWork, startAtLocation, endAtLocation } = this.state;

		this.setState({
			selectedEdition: setValue,
		});
		const locationFrom = isLocation(startAtLocation);
		const locationTo = isLocation(endAtLocation);
		this.refetchTextNodesQuery(setValue, selectedWork, locationFrom, locationTo);
	}

	selectTranslation(selectedTranslation) {
		this.setState({
			selectedTranslation: selectedTranslation
		});
	}

	showEditWorkDialog() {
		this.setState({
			editWorkDialogOpen: true,
		});
	}

	showEditEditionDialog() {
		this.setState({
			editEditionDialogOpen: true,
		});
	}

	showEditSubworkDialog() {
		this.setState({
			editSubworkDialogOpen: true,
		});
	}

	showMultilineDialog() {

		this.setState({
			multiLineDialogOpen: true,
		});
	}

	handleCloseEditWorkDialog() {
		this.setState({
			editWorkDialogOpen: false,
		});
	}

	handleCloseEditEditionDialog() {
		this.setState({
			editEditionDialogOpen: false,
		});
	}

	handleCloseEditSubworkDialog() {
		this.setState({
			editSubworkDialogOpen: false,
		});
	}

	handleCloseMultilineDialog() {
		this.setState({
			multiLineDialogOpen: false,
		});
	}

	updateStartAtLocation(e, newValue) {

		const { endAtLocation, selectedEdition, selectedWork } = this.state;
		this.setState({
			startAtLocation: newValue,
		});
		const locationFrom = isLocation(newValue);
		const locationTo = isLocation(endAtLocation);
		this.refetchTextNodesQuery(selectedEdition, selectedWork, locationFrom, locationTo);
	}
	updateEndsAtLocation(e, newValue) {

		const { startAtLocation, selectedEdition, selectedWork } = this.state;
		this.setState({
			endAtLocation: newValue,
		});
		const locationFrom = isLocation(startAtLocation) ;
		const locationTo = isLocation(newValue);
		this.refetchTextNodesQuery(selectedEdition,selectedWork,locationFrom, locationTo);
	}
	refetchTextNodesQuery(selectedEdition, selectedWork, locationFrom, locationTo) {

		const { works } = this.state;
		let finalWork;
		works.forEach(work => {
			if (work.id === selectedWork) {
				finalWork = work;
				return;
			}
		});
		if(locationFrom && locationTo
			&& selectedEdition !== undefined
			&& selectedWork !== undefined) {
			this.props.textNodesQuery.refetch({
				workUrn: finalWork.urn,
				textNodesUrn: `${finalWork.urn}:${locationFrom[0]}.${locationFrom[1]}-${locationTo[0]}.${locationTo[1]}`
			});
		}
	}
	loadMoreText() {
		this.setState({
			limit: this.state.limit + 50,
		});
	}

	renderTextNodesInput() {
		const { selectedWork, selectedEdition, startAtLocation, endAtLocation, textNodes } = this.state;

		if (!selectedWork || !selectedEdition || !startAtLocation || !endAtLocation) {
			return null;
		}

		return (
			<TextNodesInput
				textNodes={textNodes}
			/>
		);
	}

	renderTranslationNodesInput() {
		const { selectedWork, startAtLine, limit, selectedTranslation } = this.state;
		let _selectedWork;
		if (!selectedWork || typeof startAtLine === 'undefined' || startAtLine === null || !selectedTranslation) {
			return null;
		}
		this.state.works.forEach(work => {
			if (work.id === selectedWork) {
				_selectedWork = work;
			}
		});
		return (
			<TranslationNodeInput
				selectedWork={_selectedWork}
				startAtLine={startAtLine}
				limit={limit}
				selectedTranslation={selectedTranslation}
				loadMore={this.loadMoreText}
			/>
		);
	}

	render() {
		const { works, editions } = this.state;
		const { subworks, selectedWork, selectedEdition, selectedSubwork } = this.state;
		let editionsAvailable = this.state.editionsAvailable ? this.state.editionsAvailable : editions;
		let _selectedWork;
		let _selectedEdition;
		let _selectedSubwork;

		works.forEach(work => {
			if (work.id === selectedWork) {
				_selectedWork = work;
			}
			return true;
		});

		editions.forEach(edition => {
			if (edition.id === selectedEdition) {
				_selectedEdition = edition;
			}
			return true;
		});

		const workOptions = [];
		works.map(work => {
			workOptions.push({
				value: work.id,
				label: work.english_title,
			});
			return true;
		});

		const editionOptions = [];
		editionsAvailable.map(edition => {
			editionOptions.push({
				value: edition.id,
				label: edition.slug,
			});
			return true;
		});

		const subworkOptions = [];
		subworks.map(subwork => {
			subworkOptions.push({
				value: subwork.n,
				label: subwork.title,
			});
			return true;
		});

		const translationOptions = {
			selectedWork,
			selectedSubwork,
		};


		return (
			<div className="text-nodes-editor paper-shadow">
				<div className="text-nodes-editor-meta-inputs">
					<div className="text-nodes-editor-meta-input work-input">
						<FormGroup controlId="formControlsSelect">
							<ControlLabel>Work</ControlLabel>
							<Select
								name="work-select"
								value={selectedWork}
								options={workOptions}
								onChange={this.selectWork}
							/>
						</FormGroup>
					</div>
					<div className="text-nodes-editor-meta-input edition-input">
						<FormGroup controlId="formControlsSelect">
							<ControlLabel>Edition</ControlLabel>
							<Select
								name="edition-select"
								value={selectedEdition}
								options={editionOptions}
								onChange={this.selectEdition}
							/>
						</FormGroup>
					</div>
					<div className="text-nodes-editor-meta-input line-from-input">
						<FormGroup controlId="formControlsSelect">
							<ControlLabel>Start at location</ControlLabel>
							<br />
							<TextField
								hintText="0"
								onChange={this.updateStartAtLocation}
							/>
						</FormGroup>
					</div>
					<TranslationSelect
						{...translationOptions}
						selectTranslation={this.selectTranslation}
					/>

					{_selectedEdition ?
						<div className="text-nodes-editor-meta-input">
							<FormGroup controlId="multiLineButton">
								<ControlLabel>Multiline</ControlLabel>
								<br />
								<button onClick={this.showMultilineDialog}>
								Manage multiline
								</button>
							</FormGroup>
						</div>
						: ''}

					{_selectedEdition ?
						<div className="text-nodes-editor-meta-input">
							<FormGroup controlId="refsDecl">
								<ControlLabel>Document Structure (<em>RefsDecl</em>)</ControlLabel>
								<RefsDeclEditor
									initialValues={{ refsDecls: _selectedEdition.refsDecls }}
								/>
							</FormGroup>
						</div>
						: ''}
				</div>

				{
					this.state.selectedTranslation ? (
						<div className="row">
							<div className="col-lg-6">{this.renderTextNodesInput()}</div>
							<div className="col-lg-6">{this.renderTranslationNodesInput()}</div>
						</div>)
						:
						this.renderTextNodesInput()
				}

				<EditWorkDialog
					open={this.state.editWorkDialogOpen}
					handleClose={this.handleCloseEditWorkDialog}
					work={_selectedWork}
				/>
				<EditEditionDialog
					open={this.state.editEditionDialogOpen}
					handleClose={this.handleCloseEditEditionDialog}
					edition={_selectedEdition}
				/>
				<EditSubworkDialog
					open={this.state.editSubworkDialogOpen}
					handleClose={this.handleCloseEditSubworkDialog}
					subwork={_selectedSubwork}
				/>
				{_selectedEdition ?
					<MultilineDialog
						open={this.state.multiLineDialogOpen}
						handleClose={this.handleCloseMultilineDialog}
						edition={_selectedEdition}
					/> : ''}
			</div>
		);
	}
}

TextNodesEditor.propTypes = {
	editionsQuery: PropTypes.object,
	textNodesQuery: PropTypes.object,
};

export default compose(
	textNodesQuery,
	editionsQuery,
)(TextNodesEditor);
