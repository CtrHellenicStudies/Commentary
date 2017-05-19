import { CompositeDecorator } from 'draft-js';

const Link = (props) => {
	const {url} = props.contentState.getEntity(props.entityKey).getData();
	const style = {
		color: '#3b5998',
		textDecoration: 'underline',
	};
	return (
		<a href={url} style={style}>
			{props.children}
		</a>
	);
};

function findLinkEntities(contentBlock, callback, contentState) {
	contentBlock.findEntityRanges(
		(character) => {
			const entityKey = character.getEntity();

			return (
				entityKey !== null &&
				contentState.getEntity(entityKey).getType() === 'LINK'
			);
		},
		callback
	);
}

const linkDecorator = new CompositeDecorator([{
	strategy: findLinkEntities,
	component: Link,
}]);


export default linkDecorator;
export { Link, findLinkEntities };
