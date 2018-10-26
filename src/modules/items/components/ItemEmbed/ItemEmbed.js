import React from 'react';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';
import _s from 'underscore.string';
import ReactPlayer from 'react-player'
import { connect } from 'react-redux';

// redux
import editorActions from '../../../editor/actions';

import './ItemEmbed.css';


class ItemEmbed extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}


	render() {
		const itemUrl = `https://attichydria.orphe.us/items/${this.props._id}/${this.props.slug}`;

		let viewer = <div />;
		let files = [];
		let file = null;
		let imageUrl = null;

		if (this.props.files && this.props.files.length) {
			files = this.props.files;
		}

		if (files.length) {
			file = files[0];

			const fileType = file.type || '';
			const isImage = fileType.slice(0, fileType.indexOf('/')) === 'image';

			if (isImage) {
				imageUrl = `//iiif.orphe.us/${file.name}/full/300,/0/default.jpg`;
				viewer = (
					<a href={itemUrl} target="_blank">
						<img src={imageUrl} alt={this.props.title} />
					</a>
				);
			} else {
				viewer = (
					<ReactPlayer
						url={`https://s3.amazonaws.com/iiif-orpheus/${file.name}`}
						width="300"
						height="200"
						style={{
							background: '#424242',
						}}
		      />
				);
			}
		}

		return (
			<div
				className="itemEmbed"
			>
				<div className="itemEmbedInner">
					{viewer}
					<a href={itemUrl} target="_blank">
						<h3>{this.props.title}</h3>
					</a>
					<p className="description">
						{_s.prune(this.props.description, 200)}
					</p>
				</div>
			</div>
		);

	}
}

ItemEmbed.propTypes = {
	imageUrl: PropTypes.string,
	tags: PropTypes.array,
	title: PropTypes.string,
	slug: PropTypes.string,
	description: PropTypes.string,
};


const mapStateToProps = state => ({
	...state.editor,
});

const mapDispatchToProps = dispatch => ({
	setEditorState: (editorState) => {
		dispatch(editorActions.setEditorState(editorState));
	},
	setAddTooltip: (addTooltip) => {
		dispatch(editorActions.setAddTooltip(addTooltip));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ItemEmbed);
