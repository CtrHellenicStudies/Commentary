import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createContainer } from 'meteor/react-meteor-data';
import { compose } from 'react-apollo';
import Select from 'react-select';
import autoBind from 'react-autobind';
import {
	ControlLabel,
	FormGroup,
	FormControl,
} from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

// graphql
import { worksQuery } from '/imports/graphql/methods/works';
import { editionsQuery } from '/imports/graphql/methods/editions';

// actions
import * as textNodesActions from '/imports/actions/textNodes';

// models:
import Editions from '/imports/models/editions';
import TextNodes from '/imports/models/textNodes';
import Works from '/imports/models/works';

// lib:
import Utils from '/imports/lib/utils';

// components
import TextNodesInput from '../TextNodesInput';
import EditWorkDialog from '../EditWorkDialog';
import EditEditionDialog from '../EditEditionDialog';
import EditSubworkDialog from '../EditSubworkDialog';
import MultilineDialog from '../MultilineDialog';
import TranslationSelect from '../TranslationSelect/TranslationSelect';
import TranslationNodeInput from '../TranslationNodeInput/TranslationNodeInput';


class TextNodesEditor extends Component {
	constructor(props) {
		super(props);

		const selectedWork = null;
		const selectedEdition = null;
		const selectedSubwork = null;
		const selectedTranslation = null;
		const subworks = [];
		const startAtLine = null;
		const limit = 50;

		this.state = {
			subworks,
			selectedWork,
			selectedEdition,
			selectedSubwork,
			selectedTranslation,
			startAtLine,
			limit,
			editWorkDialogOpen: false,
			editEditionDialogOpen: false,
			editSubworkDialogOpen: false,
			multiLineDialogOpen: false
		};

		autoBind(this);
	}

	selectWork(event) {
		const setValue = event ? event.value : '';

		const { works } = this.props;
		let _selectedWork;

		works.forEach(work => {
			if (work._id === setValue) {
				_selectedWork = work;
			}
		});

		this.setState({
			selectedWork: setValue,
			subworks: _selectedWork ? _selectedWork.subworks.slice().sort(Utils.sortBy('n')) : [],
		});
	}

	selectEdition(event) {
		const setValue = event ? event.value : '';
		this.setState({
			selectedEdition: setValue
		});
	}

	selectSubwork(event) {
		const setValue = event ? event.value : '';
		this.setState({
			selectedSubwork: setValue
		});
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

	updateStartAtLine(e, newValue) {
		this.setState({
			startAtLine: parseInt(newValue),
		});
	}

	loadMoreText() {
		this.setState({
			limit: this.state.limit + 50,
		});
	}

	renderTextNodesInput() {
		const { subworks, selectedWork, selectedEdition, selectedSubwork, startAtLine, limit } = this.state;

		if (!selectedWork || !selectedEdition || !selectedSubwork || typeof startAtLine === 'undefined' || startAtLine === null) {
			return null;
		}

		const { works, editions } = this.props;
		let _selectedWork;
		let _selectedEdition;
		let _selectedSubwork;

		works.forEach(work => {
			if (work._id === selectedWork) {
				_selectedWork = work;
				_selectedWork.subworks.forEach(subwork => {
					if (subwork.n === selectedSubwork) {
						_selectedSubwork = subwork;
					}
				});
			}
		});

		editions.forEach(edition => {
			if (edition._id === selectedEdition) {
				_selectedEdition = edition;
			}
		});

		return (
			<TextNodesInput
				workId={_selectedWork._id}
				workSlug={_selectedWork.slug}
				editionId={_selectedEdition._id}
				subworkN={_selectedSubwork.n}
				subworkTitle={selectedSubwork.title}
				lineFrom={startAtLine}
				limit={limit}
				loadMore={this.loadMoreText}
			/>
		);
	}

	renderTranslationNodesInput() {
		const { selectedWork, selectedSubwork, startAtLine, limit, selectedTranslation } = this.state;
		let _selectedWork;
		if (!selectedWork || !selectedSubwork || typeof startAtLine === 'undefined' || startAtLine === null || !selectedTranslation) {
			return null;
		}
		this.props.works.forEach(work => {
			if (work._id === selectedWork) {
				_selectedWork = work;
			}
		});
		return (
			<TranslationNodeInput
				selectedWork={_selectedWork}
				selectedSubwork={selectedSubwork}
				startAtLine={startAtLine}
				limit={limit}
				selectedTranslation={selectedTranslation}
				loadMore={this.loadMoreText}
			/>
		);
	}

	render() {
		const { works, editions } = this.props;
		const { subworks, selectedWork, selectedEdition, selectedSubwork, startAtLine } = this.state;

		let _selectedWork;
		let _selectedEdition;
		let _selectedSubwork;

		works.forEach(work => {
			if (work._id === selectedWork) {
				_selectedWork = work;
				_selectedWork.subworks.forEach(subwork => {
					if (subwork.n === selectedSubwork) {
						_selectedSubwork = subwork;
					}
				});
			}
		});

		editions.forEach(edition => {
			if (edition._id === selectedEdition) {
				_selectedEdition = edition;
			}
		});

		const workOptions = [];
		works.map(work => {
			workOptions.push({
				value: work._id,
				label: work.title,
			});
		});

		const editionOptions = [];
		editions.map(edition => {
			editionOptions.push({
				value: edition._id,
				label: edition.title,
			});
		});

		const subworkOptions = [];
		subworks.map(subwork => {
			subworkOptions.push({
				value: subwork.n,
				label: subwork.title,
			});
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
					<div className="text-nodes-editor-meta-input subwork-input">
						<FormGroup controlId="formControlsSelect">
							<ControlLabel>Subwork (Book/Poem/Rhapsody/etc)</ControlLabel>
							<Select
								name="subwork-select"
								value={selectedSubwork}
								options={subworkOptions}
								onChange={this.selectSubwork}
							/>
						</FormGroup>
					</div>
					<div className="text-nodes-editor-meta-input line-from-input">
						<FormGroup controlId="formControlsSelect">
							<ControlLabel>Start at line</ControlLabel>
							<br />
							<TextField
								hintText="0"
								onChange={this.updateStartAtLine}
							/>
						</FormGroup>
					</div>
					<TranslationSelect {...translationOptions} selectTranslation={this.selectTranslation} />
					{_selectedEdition ?
						<div className="text-nodes-editor-meta-input">
							<FormGroup controlId="multiLineButton">
								<ControlLabel>Multiline</ControlLabel>
								<br />
								<button onClick={this.showMultilineDialog}>
								Manage multiline
							</button>
							</FormGroup>
						</div> : ''}
				</div>

				{
					this.state.selectedTranslation ? (
						<div className="row">
							<div className="col-lg-6">{this.renderTextNodesInput()}</div>
							<div className="col-lg-6">{this.renderTranslationNodesInput()}</div>
						</div>) : this.renderTextNodesInput()
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
	works: PropTypes.array,
	editions: PropTypes.array,
};


const TextNodesEditorContainer = createContainer(props => {

	const editions = props.editionsQuery.loading ? [] : props.editionsQuery.editions;
	const tenantId = sessionStorage.getItem('tenantId');
	const works = props.worksQuery.loading ? [] : props.worksQuery.works;

	return {
		works,
		editions,
	};

}, TextNodesEditor);

export default compose(
	editionsQuery,
	worksQuery
)(TextNodesEditorContainer);
