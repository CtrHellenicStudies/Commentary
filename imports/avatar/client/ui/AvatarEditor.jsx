import React from 'react';

export default class AvatarEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			avatarUrl: props.defaultAvatarUrl,
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			avatarUrl: nextProps.avatar.url? nextProps.avatar.url : nextProps.defaultAvatarUrl,
		});
	}

	render() {
		return (<div className="user-profile-picture" onClick={this.props.handleUploadAvatar}>
			<img src={this.state.avatarUrl} />
			
			<div className="upload-profile-picture">
				<i className="mdi mdi-image-area"></i>
				<span className="help-text">
					Select to upload or drag and drop.
				</span>

				{/*<Dropzone
					className="dropzone"
					ref="dropzone"
					onDrop={this.onDrop}>
				</Dropzone>*/}

			</div>
		</div>);
	}
}

AvatarEditor.propTypes = {
	handleUploadAvatar: React.PropTypes.func,
	defaultAvatarUrl: React.PropTypes.string.isRequired,
	avatar: React.PropTypes.object,
	avatarLoading: React.PropTypes.bool,
};

AvatarEditor.defaultProps = {
	handleUploadAvatar: () => {},
	defaultAvatarUrl: '',
	avatar: {},
	avatarLoading: false,
};
