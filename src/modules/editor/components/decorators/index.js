import { CompositeDecorator } from 'draft-js';

import { Link, findLinkEntities } from './Link';
import { Gloss, findGlossEntities } from './Gloss';


const decorators = new CompositeDecorator([
	{
		strategy: findLinkEntities,
		component: Link,
	},
	{
		strategy: findGlossEntities,
		component: Gloss,
	},
]);

export default decorators;
