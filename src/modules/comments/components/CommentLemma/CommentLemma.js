import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { compose } from 'react-apollo';
import { Sticky } from 'react-sticky';
import autoBind from 'react-autobind';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';


// components
import CommentGroupMeta from './CommentGroupMeta';
import CommentLemmaInner from './CommentLemmaInner';

// lib
import Utils from '../../../../lib/utils';


class CommentLemma extends Component {

	constructor(props) {
		super(props);

		this.state = {
			showTranslation: false,
			translationMenuOpen: false,
			multilineMenuOpen: false,
		};

		autoBind(this);
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

	render() {
		const { commentGroup, editions, selectedLemmaEdition, translationAuthors, hideLemma } = this.props;
		const { selectedAuthor, showTranslation } = this.state;

		// TODO: use work from query
		let workTitle = commentGroup.lemmaCitation.work;

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
					<CommentLemmaInner
						commentGroup={commentGroup}
						showTranslation={showTranslation}
						textNodes={selectedLemmaEdition.textNodes}
						author={selectedAuthor}
					/>

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

CommentLemma.propTypes = {
	commentGroup: PropTypes.shape({
		lemmaCitation: PropTypes.shape({
			textGroup: PropTypes.string,
			work: PropTypes.string,
			passageFrom: PropTypes.arrayOf(PropTypes.number),
			passageTo: PropTypes.arrayOf(PropTypes.number),
		}),
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
	// translationsQuery: PropTypes.object
};

CommentLemma.defaultProps = {
	editions: null
};

export default CommentLemma;
