import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const TranslationNodes = new Meteor.Collection('translationNodes');

TranslationNodes.schema = new SimpleSchema({
	tenantId: {
		type: String,
		optional: true
	},
	created: {
		type: Date,
		optional: true
	},
	updated: {
		type: Date,
		optional: true
	},
	author: {
		type: String,
		optional: true
	},
	work: {
		type: String,
		optional: true
	},
	subwork: {
		type: Number,
		optional: true
	},
	n: {
		type: Number,
		optional: true
	},
	text: {
		type: String,
	}
});

TranslationNodes.attachSchema(TranslationNodes.schema);

TranslationNodes.attachBehaviour('timestampable', {
	createdAt: 'created',
	updatedAt: 'updated',
});

export default TranslationNodes;
