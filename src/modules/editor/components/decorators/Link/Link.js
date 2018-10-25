import React from 'react'
import autoBind from 'react-autobind';
import {
	CompositeDecorator,
 } from 'draft-js'


class Link extends React.Component {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	showLinkPopOver(e) {
		if (!this.data.showLinkPopOver) {
			return false;
		}

		return this.data.showLinkPopOver(this.refs.link);
	}

	hideLinkPopOver(e) {
		if (!this.data.hideLinkPopOver) {
			return false;
		}

		return this.data.hideLinkPopOver();
	}

	render() {
		const { contentState, entityKey, linkPopoverShown } = this.props;
		this.data = contentState.getEntity(entityKey).getData();

		return (
			<a
				href={this.data.url}
				className={`link ${linkPopoverShown ? 'linkPopoverShown' : ''}`}
				onMouseOver={this.showLinkPopOver}
				onMouseOut={this.hideLinkPopOver}
			>
				{ this.props.children }
			</a>
		);
	}
}

const findLinkEntities = (contentBlock, callback, contentState) => {
	contentBlock.findEntityRanges(
		(character) => {
			const entityKey = character.getEntity();

			return (
				entityKey !== null &&
				contentState.getEntity(entityKey).getType() === 'LINK'
			);
		},
		callback,
	);
}

const linkDecorator = new CompositeDecorator([{
	strategy: findLinkEntities,
	component: Link,
}]);

export default linkDecorator;
export { Link, findLinkEntities };
