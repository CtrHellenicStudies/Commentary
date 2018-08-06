import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import _s from 'underscore.string';
import TextField from 'material-ui/TextField';
import Drawer from 'material-ui/Drawer';
import { Card, CardHeader, CardText } from 'material-ui/Card';

// components
import SearchTermButtonPanel from '../SearchTermButtonPanel';
import WorksCard from '../WorksCard';


const CommentarySearchPanel = ({
	keyideas, keywords, commenters, works, referenceWorks, open, closeRightMenu,
	handleChangeTextsearch,
}) => {

	const styles = {
		drawer: {
			backgroundColor: '#ddd',
		},
		flatButton: {
			width: 'auto',
			minWidth: 'none',
			height: '80px',
			padding: '21px 5px',
		},
		flatIconButton: {
			padding: '10px 20px',
			width: 'auto',
			minWidth: 'none',
			height: '55px',
		},
		wrapper: {
			display: 'flex',
			flexWrap: 'wrap',
		},
		textSearch: {
			width: '100%',
			padding: '0px 10px',
			background: '#f2f2f2',
		},
		cardHeader: {
			fontFamily: 'Proxima Nova',
			textTransform: 'uppercase',
			fontSize: '14px',
			fontWeight: 'bold',
		},
		lineSearch: {
			width: '99%',
			margin: '0px auto',
		},
	};

	let drawerWidth = 400;
	if (window.innerWidth < 500) {
		drawerWidth = 300;
	}
	if (window.innerWidth < 300) {
		drawerWidth = 210;
	}

	return (
		<Drawer
			width={drawerWidth}
			className="search-tools-drawer"
			openSecondary
			open={open}
			docked={false}
			onRequestChange={closeRightMenu}
			style={styles.drawer}
		>
			<div className="search-tool text-search text-search--drawer">
				<TextField
					hintText=""
					floatingLabelText="Search"
					fullWidth
					onChange={_.debounce(handleChangeTextsearch, 300)}
				/>
			</div>

			<WorksCard
				works={works}
				styles={styles}
			/>

			<Card
				className="search-tool-card"
			>
				<CardHeader
					title="Keywords"
					style={styles.cardHeader}
					actAsExpander
					showExpandableButton
					className="card-header"
				/>
				<CardText expandable style={styles.wrapper}>
					{keywords && keywords.map((keyword, i) => (
						<SearchTermButtonPanel
							key={i}
							label={keyword.title}
							searchTermKey="keywords"
							value={keyword}
							active={false}
						/>
					))}
				</CardText>
			</Card>
			<Card
				className="search-tool-card"
			>
				<CardHeader
					title="Key Ideas"
					style={styles.cardHeader}
					actAsExpander
					showExpandableButton
					className="card-header"
				/>
				<CardText expandable style={styles.wrapper}>
					{keyideas && keyideas.map((keyidea, i) => (
						<SearchTermButtonPanel
							key={i}
							label={keyidea.title}
							searchTermKey="keyideas"
							value={keyidea}
							active={false}
						/>
					))}
				</CardText>
			</Card>
			<Card
				className="search-tool-card"
			>
				<CardHeader
					title="Commentator"
					style={styles.cardHeader}
					actAsExpander
					showExpandableButton
					className="card-header"
				/>
				<CardText expandable style={styles.wrapper}>
					{commenters && commenters.map((commenter, i) => (
						<SearchTermButtonPanel
							key={i}
							label={commenter.name}
							searchTermKey="commenters"
							value={commenter}
							active={false}
						/>
					))}
				</CardText>
			</Card>
			<Card
				className="search-tool-card"
			>
				<CardHeader
					title="Reference"
					style={styles.cardHeader}
					actAsExpander
					showExpandableButton
					className="card-header"
				/>
				<CardText expandable style={styles.wrapper}>
					{referenceWorks && referenceWorks.map((reference, i) => (
						<SearchTermButtonPanel
							key={i}
							label={_s.truncate(reference.title, 30)}
							searchTermKey="reference"
							value={reference}
							active={false}
						/>
					))}
				</CardText>
			</Card>
		</Drawer>
	);
}

CommentarySearchPanel.propTypes = {
	open: PropTypes.bool,
	closeRightMenu: PropTypes.func,
	keyideas: PropTypes.array,
	keywords: PropTypes.array,
	commenters: PropTypes.array,
	works: PropTypes.array,
	referenceWorks: PropTypes.array,
};

export default CommentarySearchPanel;
