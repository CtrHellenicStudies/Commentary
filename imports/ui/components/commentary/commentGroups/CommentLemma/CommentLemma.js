import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { compose } from 'react-apollo';
import { editionsQuery } from '/imports/graphql/methods/editions';
import { createContainer } from 'meteor/react-meteor-data';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import FontIcon from 'material-ui/FontIcon';
import { Sticky } from 'react-sticky';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import _ from 'underscore';

// models:
import TextNodes from '/imports/models/textNodes';
import Translations from '/imports/models/translations';
import TranslationNodes from '/imports/models/translationNodes';

// components:
import CommentLemmaText from '/imports/ui/components/commentary/commentGroups/CommentLemmaText';
import CommentGroupMeta from '/imports/ui/components/commentary/commentGroups/CommentGroupMeta';
import TranslationLayout from '/imports/ui/layouts/commentary/TranslationLayout';
import LoadingLemma from '/imports/ui/components/loading/LoadingLemma';

// lib:
import Utils from '/imports/lib/utils';

class CommentLemma extends React.Component {

	static propTypes = {
		commentGroup: PropTypes.shape({
			work: PropTypes.shape({
				slug: PropTypes.string.isRequired,
				title: PropTypes.string.isRequired,
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

		// from createContainer:
		editions: PropTypes.arrayOf(PropTypes.shape({
			title: PropTypes.string.isRequired,
			slug: PropTypes.string.isRequired,
		})),
		ready: PropTypes.bool,
	};

	static defaultProps = {
		editions: null,
		ready: false,
	};

	constructor(props) {
		super(props);

		this.state = {
			selectedLemmaEditionIndex: 0,
			showTranslation: false,
			translationMenuOpen: false,
			multilineMenuOpen: false,
			multiline: null
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
		const { editions } = this.props;
		const { selectedLemmaEditionIndex } = this.state;

		if (editions && editions.length) {
			if (editions[selectedLemmaEditionIndex].slug !== editionSlug) {
				let newSelectedEditionIndex = 0;

				editions.forEach((edition, index) => {
					if (edition.slug === editionSlug) {
						newSelectedEditionIndex = index;
					}
				});

				this.setState({
					selectedLemmaEditionIndex: newSelectedEditionIndex,
				});
			}
		}
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
	handleCloseMultilineMenu() {
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


	render() {
		const { commentGroup, hideLemma, editions, ready, translationAuthors } = this.props;
		const { selectedLemmaEditionIndex, selectedAuthor, showTranslation } = this.state;

		const selectedLemmaEdition = editions[selectedLemmaEditionIndex] || { lines: [] };
		selectedLemmaEdition.lines.sort(Utils.sortBy('subwork.n', 'n'));

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
							lines={selectedLemmaEdition.lines}
							author={selectedAuthor}
						/>
						:
						<LoadingLemma />
					}

					<div className="edition-tabs tabs" />
					<div className="edition-tabs tabs">
						{editions.map((lemmaTextEdition, i) => {
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
						})}

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

const cont = createContainer(props => {
	
	const { commentGroup, multiline } = props;

	let lemmaQuery = {};
	let translationAuthors = [];
	const translationNodesHandle = Meteor.subscribe('translationNodes', Session.get('tenantId'));
	if (commentGroup) {
		lemmaQuery = {
			'work.slug': commentGroup.work.slug,
			'subwork.n': commentGroup.subwork.n,
			'text.n': {
				$gte: commentGroup.lineFrom,
			},
		};

		if (typeof commentGroup.lineTo !== 'undefined') {
			lemmaQuery['text.n'].$lte = commentGroup.lineTo;
		} else {
			lemmaQuery['text.n'].$lte = commentGroup.lineFrom;
		}
		if (lemmaQuery['work.slug'] === 'homeric-hymns') {
			lemmaQuery['work.slug'] = 'hymns';
		}

		if (!commentGroup.lineTo) {
			commentGroup.lineTo = commentGroup.lineFrom;
		}

		const translationNodesQuery = {
			work: commentGroup.work.slug,
			subwork: Number(commentGroup.subwork.title),
			$and: [{n: {$gte: commentGroup.lineFrom}}, {n: {$lte: commentGroup.lineTo}}],
		};

		translationAuthors = _.uniq(
			TranslationNodes.find(translationNodesQuery)
				.fetch()
				.map(translation => translation.author)
			);
	}

	const handle = Meteor.subscribe('textNodes', lemmaQuery);
	const textNodesCursor = TextNodes.find(lemmaQuery);
	let editions = !props.editionsQuery.loading ?
		Utils.textFromTextNodesGroupedByEdition(textNodesCursor, props.editionsQuery.editions) : [];

	editions = multiline ? Utils.parseMultilineEdition(editions, multiline) : editions;

	return {
		translationAuthors,
		editions,
		ready: handle.ready() && translationNodesHandle.ready(),
	};

}, CommentLemma);
export default (editionsQuery)(cont);
