import React from 'react';
import autoBind from 'react-autobind';


class ImageBlockLoader extends React.Component {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	renderLoading() {

		if (this.props.progress === 100) {
			return (
				<span>
					Processing image ...
				</span>
			);
		}

		return (
			<span>
				<span>Uploading</span> { Math.round( this.props.progress * 100 ) }
			</span>
		);
	}

	render() {
		return (
			<div>
				{ this.props.toggle ?
					<div className="imageUploaderLoader">
						<p>
							{this.renderLoading()}
						</p>
					</div>
		: ''}
			</div>
		)
	}
}

export default ImageBlockLoader;
