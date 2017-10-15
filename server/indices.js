/**
 * Add mongo indices to collections
 */

import Comments from '/imports/models/comments';
import Commenters from '/imports/models/commenters';
import TextNodes from '/imports/models/textNodes';

Comments._ensureIndex({
	'$**': 'text',
});

Comments._ensureIndex({
	'work.order': 1,
	'subwork.n': 1,
	lineFrom: 1,
	nLines: -1,
});

Comments._ensureIndex({
	'keywords._id': 1,
});

TextNodes._ensureIndex({
	'work.slug': 1,
	'subwork.n': 1,
	'text.n': 1,
});

Commenters._ensureIndex({
	name: 1,
});
