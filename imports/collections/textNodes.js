import Tenants from '/imports/collections/tenants';
import Editions from '/imports/collections/editions';

const TextNodes = new Meteor.Collection('textNodes');

TextNodes.schema = new SimpleSchema({
	tenantId: {
	    type: String,
	    label: "Tenant",
	    optional: true,
	    autoform: {
	    	afFieldInput: {
	    		type: "select",
		      options: function () {
		      	var tenants = [];
		        _.map(Tenants.find().fetch(), function (tenant) {

		          tenants.push({
		            label: tenant.subdomain,
		            value: tenant._id
		          });

		        });
		        return tenants;
		      }
	    	}
	    }
	},

	text: {
		type: [Object],
	},

	'text.$.n': {
		type: Number,
	},
	'text.$.text': {
		type: String,
	},
	'text.$.html': {
		type: String,
	},
	'text.$.edition': {
		type: [Editions.schema],
	},

	work: {
		type: Object,
	},
	// 'work.id': { type: ObjectId }, // TODO: objectid type?
	'work.slug': {
		type: String,
	},

	subwork: {
		type: Object,
	},
	'subwork.title': {
		type: String
	},
	'subwork.n': {
		type: Number
	},

	// entities: [] // TODO:
	// "commentary" : [ ],
	// 	"scansion" : [ ],
	// 	"media" : [ ],
	// 	"definitions" : [ ],
	// 	"translations" : [ ],
	// 	"articles" : [ ],

	related_passages: {
		type: [Object]
	},
	// "related_passages" : [
	// 		{
	// 			"text" : {
	// 				"text" : "ἠμὲν ὅσ' ἐν πόντῳ πάθετ' ἄλγεα ἰχθυόεντι,",
	// 				"n" : 458
	// 			},
	// 			"tsi" : 64.44444444444444,
	// 			"author" : {
	// 				"name" : "Homer"
	// 			},
	// 			"work" : {
	// 				"slug" : "odyssey",
	// 				"title" : "Odyssey"
	// 			},
	// 			"subwork" : {
	// 				"n" : 10
	// 			}
	// 		},
	// 		{
	// 			"text" : {
	// 				"text" : "ἠμὲν ὅσʼ ἐν πόντῳ πάθετʼ ἄλγεα ἰχθυόεντι,",
	// 				"n" : 457
	// 			},
	// 			"tsi" : 62.22222222222222,
	// 			"author" : {
	// 				"name" : "Homer"
	// 			},
	// 			"work" : {
	// 				"slug" : "odyssey",
	// 				"title" : "Odyssey"
	// 			},
	// 			"subwork" : {
	// 				"n" : 10
	// 			}
	// 		},
	// 		{
	// 			"text" : {
	// 				"text" : "ἠμὲν ὅσ' ἐν πόντῳ πάθετ' ἄλγεα ἰχθυόεντι,",
	// 				"n" : 458
	// 			},
	// 			"tsi" : 62.22222222222222,
	// 			"author" : {
	// 				"name" : "Homer"
	// 			},
	// 			"work" : {
	// 				"slug" : "odyssey",
	// 				"title" : "Odyssey"
	// 			},
	// 			"subwork" : {
	// 				"n" : 10
	// 			}
	// 		},
	// 		{
	// 			"text" : {
	// 				"text" : "ἠμὲν ὅσʼ ἐν πόντῳ πάθετʼ ἄλγεα ἰχθυόεντι,",
	// 				"n" : 457
	// 			},
	// 			"tsi" : 64.44444444444444,
	// 			"author" : {
	// 				"name" : "Homer"
	// 			},
	// 			"work" : {
	// 				"slug" : "odyssey",
	// 				"title" : "Odyssey"
	// 			},
	// 			"subwork" : {
	// 				"n" : 10
	// 			}
	// 		}
	// 	],
});

TextNodes.attachSchema(TextNodes.schema);

export default TextNodes;