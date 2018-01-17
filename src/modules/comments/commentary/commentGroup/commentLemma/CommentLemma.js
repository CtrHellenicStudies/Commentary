import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { Sticky } from 'react-sticky';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import _ from 'underscore';

// graphql
import { textNodesQuery } from '../../../../../graphql/methods/textNodes';
import { editionsQuery } from '../../../../../graphql/methods/editions';
import { translationsQuery } from '../../../../../graphql/methods/translations';

// components:
import CommentGroupMeta from './CommentGroupMeta';
import TranslationLayout from './translation/TranslationLayout';
import LoadingLemma from '../../../../../components/loading/LoadingLemma';

// lib:
import Utils from '../../../../../lib/utils';

function getTranslationQueries(query, filter) {
	if (query.loading) {
		return [];
	}
	return query.translations.filter(x => 
		x.work === filter.work && 
		x.subwork === filter.subwork &&
		x.n >= filter.lineFrom &&
		x.n <= filter.lineTo).map(translation =>
			translation.author
		);
}
class CommentLemma extends Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedLemmaEditionIndex: 0,
			showTranslation: false,
			translationMenuOpen: false,
			multilineMenuOpen: false,
			multiline: null,
			translationAuthors: [],
			editions: []
		};

		// methods:
		this.toggleEdition = this.toggleEdition.bind(this);
		this.showContextPanel = this.showContextPanel.bind(this);
		this.handleAuthorChange = this.handleAuthorChange.bind(this);
		this.handleOpenTranslationMenu = this.handleOpenTranslationMenu.bind(this);
		this.handleOpenMultilineMenu = this.handleOpenMultilineMenu.bind(this);
		this.handleCloseMultilineMenu = this.handleCloseMultilineMenu.bind(this);
		this.handleMultilineSelect = this.handleMultilineSelect.bind(this);
	}


	toggleEdition(editionSlug) {
		// const { editions } = this.props;
		// const { selectedLemmaEditionIndex } = this.state;

		// if (editions && editions.length) {
		// 	if (editions[selectedLemmaEditionIndex].slug !== editionSlug) {
		// 		let newSelectedEditionIndex = 0;

		// 		editions.forEach((edition, index) => {
		// 			if (edition.slug === editionSlug) {
		// 				newSelectedEditionIndex = index;
		// 			}
		// 		});

		// 		// this.setState({
		// 		// 	selectedLemmaEditionIndex: newSelectedEditionIndex,
		// 		// });
		// 	}
		// }
	}

	showContextPanel(commentGroup) {
		const { index, setScrollPosition, showContextPanel } = this.props;

		setScrollPosition(index);
		showContextPanel(commentGroup);
	}

	handleAuthorChange(event, value) {
		const { selectedAuthor, showTranslation } = this.state;

		if (!selectedAuthor) {
			this.setState({
				selectedAuthor: value,
				showTranslation: true,
				translationsMenuOpen: false,
			});
		} else if (selectedAuthor === value) {
			this.setState({
				showTranslation: !showTranslation,
				translationsMenuOpen: false,
			});
		} else if (selectedAuthor !== value) {
			this.setState({
				selectedAuthor: value,
				showTranslation: true,
				translationsMenuOpen: false,
			});
		}
	}

	handleMultilineSelect(event, value) {
		this.props.selectMultiLine(value);

		this.setState({
			multilineMenuOpen: false,
		});
	}

	handleOpenTranslationMenu(event) {
    // This prevents ghost click.
		event.preventDefault();

		const { translationsMenuOpen } = this.state;

		this.setState({
			translationsMenuOpen: !translationsMenuOpen,
			anchorEl: event.currentTarget,
		});
	}

	handleOpenMultilineMenu(event) {
		// This prevents ghost click.
		event.preventDefault();

		const { multilineMenuOpen } = this.state;

		this.setState({
			multilineMenuOpen: !multilineMenuOpen,
			multilineAnchorEl: event.currentTarget,
		});
	}
	handleCloseMultilineMenu(event) {
		// This prevents ghost click.
		event.preventDefault();

		this.setState({
			multilineMenuOpen: false,
		});
	}

	handleOpenEditionMenu() {
		const { openEditionMenu } = this.state;

		this.setState({
			openEditionMenu: !openEditionMenu
		});
	}

	componentWillReceiveProps(nextProps) {

		const { commentGroup, multiline } = nextProps;
//		const { selectedLemmaEditionIndex } = this.state;

<<<<<<< HEAD
		if (nextProps.collectionQuery.loading || 
//			nextProps.editionsQuery.loading || 
			nextProps.translationsQuery.loading) {
			return;
		}
		console.log()
		const textNodesCursor = nextProps.collectionQuery.collection ? nextProps.collectionQuery.collection.textGroup.work.textNodes: [];
	//	let editions = Utils.textFromTextNodesGroupedByEdition(textNodesCursor, nextProps.editionsQuery.editions);
=======
		if (nextProps.textNodesQuery.loading || 
			nextProps.editionsQuery.loading || 
			nextProps.translationsQuery.loading) {
			return;
		}
		const textNodesCursor = nextProps.textNodesQuery.textNodesAhcip;
		let editions = Utils.textFromTextNodesGroupedByEdition(textNodesCursor, nextProps.editionsQuery.editions);
>>>>>>> develop
		const ready = true;
	//	editions = multiline ? Utils.parseMultilineEdition(editions, multiline) : editions;
	//	const selectedLemmaEdition = editions[selectedLemmaEditionIndex] || { lines: [] };
	//	selectedLemmaEdition.lines.sort(Utils.sortBy('subwork.n', 'n'));
		let translationAuthors = [];
<<<<<<< HEAD
		if (commentGroup && commentGroup.comments[0].lemmaCitation) {
			if (!nextProps.collectionQuery.variables.work) {
				nextProps.collectionQuery.variables.work = commentGroup.work.slug;
				console.log(commentGroup);
				const cuttedPassage = commentGroup.comments[0].lemmaCitation.passage.split('-');
				const properties = Utils.getCollectionQueryProperties(commentGroup.comments[0].lemmaCitation);
				nextProps.collectionQuery.refetch(properties);
=======
		if (commentGroup) {
			if (!nextProps.textNodesQuery.variables.workSlug) {
				nextProps.textNodesQuery.variables.workSlug = commentGroup.work.slug;
				const properties = {
					workSlug: commentGroup.work.slug,
					subworkN: Number(commentGroup.subwork.title),
					lineFrom: commentGroup.lineFrom,
					lineTo: commentGroup.lineTo ? commentGroup.lineTo : commentGroup.lineFrom

				};
				nextProps.textNodesQuery.refetch(properties);
>>>>>>> develop
			}
			if (!commentGroup.lineTo) {
				commentGroup.lineTo = commentGroup.lineFrom;
			}
	
			const translationNodesQuery = {
				work: commentGroup.work.slug,
				subwork: Number(commentGroup.subwork.title),
				lineFrom: commentGroup.lineFrom,
				lineTo: commentGroup.lineTo
			};
	
			translationAuthors = _.uniq(getTranslationQueries(nextProps.translationsQuery, translationNodesQuery));
		}

		this.setState({
			translationAuthors: translationAuthors,
			ready: ready,
		//	editions: editions,
		//	selectedLemmaEdition: selectedLemmaEdition
		});
	}
	render() {
		const { commentGroup, hideLemma } = this.props;
		const { selectedAuthor, showTranslation, ready, translationAuthors } = this.state;
		let workTitle = commentGroup.work.title;
		if (workTitle === 'Homeric Hymns') {
			workTitle = 'Hymns';
		}

		return (
			<div className="comment-outer comment-lemma-comment-outer">
				<Sticky
					bottomOffset={250}
				>
					<CommentGroupMeta
						hideLemma={hideLemma}
						commentGroup={commentGroup}
					/>
				</Sticky>

				<article className="comment lemma-comment paper-shadow">
					{translationAuthors.length > 0 && !showTranslation ?
						<div className="translation-available-flag">
							<i className="mdi mdi-comment-alert" />
							<label className="translation-available-label">
								{translationAuthors.length === 1 ?
									'A commentator has translated this passage'
								:
									`${translationAuthors.length} commentators have translated this passage`
								}
							</label>
						</div>
					:
						''
					}
					{ready ?
						<TranslationLayout
							commentGroup={commentGroup}
							showTranslation={showTranslation}
						//	lines={selectedLemmaEdition.lines}
							author={selectedAuthor}
						/>
						:
						<LoadingLemma />
					}

					<div className="edition-tabs tabs" />
					<div className="edition-tabs tabs">
						{/* {editions.map((lemmaTextEdition, i) => {
							const lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 41);
							const multiLineList = lemmaTextEdition.multiLine && lemmaTextEdition.multiLine.length ? lemmaTextEdition.multiLine : [];

							const editionButton = (
								<RaisedButton
									key={`${lemmaTextEdition.slug}-${i}`}
									label={lemmaEditionTitle}
									data-edition={lemmaTextEdition.title}
									className={selectedLemmaEdition.slug === lemmaTextEdition.slug ?
										'edition-tab tab selected-edition-tab' : 'edition-tab tab'}
									onClick={this.toggleEdition.bind(null, lemmaTextEdition.slug)}
								/>
							);
							const multiLine = multiLineList.length ? (
								<RaisedButton
									key={`${lemmaTextEdition.slug}-multi-${i}`}
									icon={<FontIcon className="mdi mdi-chevron-down" />}
									className="edition-multiline"
									onClick={this.handleOpenMultilineMenu}
								/>
							) : '';

							const popover = (
								<Popover
									key={`${lemmaTextEdition.slug}-popover-${i}`}
									open={this.state.multilineMenuOpen}
									anchorEl={this.state.multilineAnchorEl}
									anchorOrigin={{
										horizontal: 'left',
										vertical: 'bottom',
									}}
									targetOrigin={{
										horizontal: 'left',
										vertical: 'top',
									}}
									onRequestClose={this.handleRequestClose}
									animation={PopoverAnimationVertical}
								>
									<Menu
										onChange={this.handleMultilineSelect}
										className="translation-author-menu"
									>
										<MenuItem
											key={'regular'}
											value={null}
											primaryText="Regular"
											className="translation-author-menu-item"
											style={{
												fontFamily: '"Proxima Nova A W07 Light", sans-serif',
												fontSize: '12px',
											}}
										/>
										{multiLineList.map((author, i) => (
											<MenuItem
												key={`${author}-${i}`}
												value={author}
												primaryText={author}
												className="translation-author-menu-item"
												style={{
													fontFamily: '"Proxima Nova A W07 Light", sans-serif',
													fontSize: '12px',
												}}
											/>
										))}
									</Menu>
								</Popover>
							);

							return (
								<div
									key={`${lemmaTextEdition.slug}-${i}`}
									className="edition-tab-outer"
								>
									{editionButton}
									{multiLine}
									{popover}
								</div>
							);
						})} */}

						{translationAuthors.length > 0 ?
							<RaisedButton
								onTouchTap={this.handleOpenTranslationMenu}
								label="Translation"
								className={`edition-tab tab translation-tab ${showTranslation} ? 'translation-tab--active' : ''}`}
							/>
						: ''}
						<Popover
							open={this.state.translationsMenuOpen}
							anchorEl={this.state.anchorEl}
							anchorOrigin={{
								horizontal: 'left',
								vertical: 'bottom',
							}}
							targetOrigin={{
								horizontal: 'left',
								vertical: 'top',
							}}
							onRequestClose={this.handleRequestClose}
							animation={PopoverAnimationVertical}
						>
							<Menu
								onChange={this.handleAuthorChange}
								className="translation-author-menu"
							>
								{translationAuthors.map((author, i) => (
									<MenuItem
										key={`${author}-${i}`}
										value={author}
										primaryText={author}
										className="translation-author-menu-item"
										style={{
											fontFamily: '"Proxima Nova A W07 Light", sans-serif',
											fontSize: '12px',
										}}
									/>
								))}
							</Menu>
						</Popover>
					</div>
					<div className="context-tabs tabs">
						<RaisedButton
							className="context-tab tab"
							onClick={this.showContextPanel.bind(null, this.props.commentGroup)}
							label="Context"
							labelPosition="before"
							icon={<FontIcon className="mdi mdi-chevron-right" />}
						/>
					</div>
				</article>
				<div className="discussion-wrap" />
			</div>
		);
	}

}
CommentLemma.propTypes = {
	commentGroup: PropTypes.shape({
		work: PropTypes.shape({
			slug: PropTypes.string,
			title: PropTypes.string,
		}),
		subwork: PropTypes.shape({
			n: PropTypes.number.isRequired,
		}),
		lineFrom: PropTypes.number.isRequired,
		lineTo: PropTypes.number,
		commenters: PropTypes.objectOf(PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			slug: PropTypes.string.isRequired,
			avatar: PropTypes.shape({
				src: PropTypes.string,
			})
		}))
	}).isRequired,
	showContextPanel: PropTypes.func.isRequired,
	setScrollPosition: PropTypes.func.isRequired,
	index: PropTypes.string.isRequired,
	hideLemma: PropTypes.bool.isRequired,
	translationAuthors: PropTypes.array,
	multiline: PropTypes.bool,
	selectMultiLine: PropTypes.func,

	editions: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
	})),
	editionsQuery: PropTypes.object,
	textNodesQuery: PropTypes.object,
	translationsQuery: PropTypes.object
};
CommentLemma.defaultProps = {
	editions: null
};
export default compose(
	editionsQuery,
	textNodesQuery,
	translationsQuery
)(CommentLemma);
