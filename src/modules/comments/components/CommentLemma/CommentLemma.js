import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _s from 'underscore.string';
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

import './CommentLemma.css';


class CommentLemma extends Component {

	constructor(props) {
		super(props);

		this.state = {
			showTranslation: false,
			translationMenuOpen: false,
			multilineMenuOpen: false,
			versionMenuOpen: false,
		};

		autoBind(this);
	}

	showContextPanel(commentGroup) {
		const { index, setScrollPosition, showContextPanel } = this.props;

		setScrollPosition(index);
		showContextPanel(commentGroup);
	}

	handleMultilineSelect(event, value) {
		this.props.selectMultiLine(value);

		this.setState({
			multilineMenuOpen: false,
		});
	}

	handleToggleTranslationMenu(event) {
    // This prevents ghost click.
		event.preventDefault();

		const { translationsMenuOpen } = this.state;

		this.setState({
			translationsMenuOpen: !translationsMenuOpen,
			anchorEl: event.currentTarget,
		});
	}

	handleRequestCloseTranslationMenu() {
		this.setState({
			translationsMenuOpen: false,
		});
	}

	handleToggleMultilineMenu(event) {
		// This prevents ghost click.
		event.preventDefault();

		const { multilineMenuOpen } = this.state;

		this.setState({
			multilineMenuOpen: !multilineMenuOpen,
			multilineAnchorEl: event.currentTarget,
		});
	}

	handleToggleVersionMenu(event) {
		// This prevents ghost click.
		event.preventDefault();

		const { multilineMenuOpen } = this.state;

		this.setState({
			versionMenuOpen: !multilineMenuOpen,
			versionAnchorEl: event.currentTarget,
		});
	}

	handleRequestCloseVersionMenu() {
		this.setState({
			versionMenuOpen: false,
		});
	}

	toggleVersion(e, value) {
		this.setState({
			versionMenuOpen: false,
		});
		this.props.toggleVersion(value);
	}

	render() {
		const {
			commentGroup, versions, selectedLemmaVersion, translations, hideLemma,
		} = this.props;
		const { showTranslation } = this.state;

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
						textNodes={selectedLemmaVersion.textNodes}
					/>

					<div className="version-tabs tabs">
						<div
							className="version-tab-outer"
						>
							<RaisedButton
								label="Versions"
								className="version-tab"
								onClick={this.handleToggleVersionMenu}
							/>
							<Popover
								open={this.state.versionMenuOpen}
								anchorEl={this.state.versionAnchorEl}
								anchorOrigin={{
									horizontal: 'left',
									vertical: 'bottom',
								}}
								targetOrigin={{
									horizontal: 'left',
									vertical: 'top',
								}}
								onRequestClose={this.handleRequestCloseVersionMenu}
								animation={PopoverAnimationVertical}
							>
								<Menu
									value={selectedLemmaVersion.id}
									onChange={this.toggleVersion}
									className="version-menu"
								>
									{versions.map((version, i) => {
										const lemmaVersionTitle = _s.prune(version.title, 30);
										return (
											<MenuItem
												key={version.id}
												value={version.id}
												primaryText={lemmaVersionTitle}
												className="menu-item version-menu-item"
												style={{
													fontFamily: '"Proxima Nova A W07 Light", sans-serif',
													fontSize: '12px',
												}}
											/>
										)
									})}
								</Menu>
							</Popover>
						</div>

						{	/*
							const multiLine = multiLineList.length ? (
								<RaisedButton
									key={`${lemmaTextVersion.slug}-multi-${i}`}
									icon={<FontIcon className="mdi mdi-chevron-down" />}
									className="version-multiline"
									onClick={this.handleToggleMultilineMenu}
								/>
							) : '';

							const popover = (
								<Popover
									key={`${lemmaTextVersion.slug}-popover-${i}`}
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
							*/
						}

						{translations.length > 0 ?
							<RaisedButton
								onTouchTap={this.handleToggleTranslationMenu}
								label="Translation"
								className={`version-tab tab translation-tab ${showTranslation} ? 'translation-tab--active' : ''}`}
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
							onRequestClose={this.handleRequestCloseTranslationMenu}
							animation={PopoverAnimationVertical}
						>
							<Menu
								onChange={this.handleAuthorChange}
								className="translation-author-menu"
							>
								{translations.map((translation, i) => (
									<MenuItem
										key={translation.id}
										value={translation.id}
										primaryText={translation.title}
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
	multiline: PropTypes.bool,
	selectMultiLine: PropTypes.func,

	translations: PropTypes.array,

	versions: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
	})),
};

CommentLemma.defaultProps = {
	versions: null
};

export default CommentLemma;
