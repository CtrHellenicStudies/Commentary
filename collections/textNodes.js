this.TextNodes = new Meteor.Collection('textNodes');

Schemas.TextNodes = new SimpleSchema({
	text: {type: [Object]},

	'text.$.n': {type: Number},
	'text.$.text': {type: String},
	'text.$.html': {type: String},
	'text.$.edition': {type: Object},
	'text.$.edition.title': {type: String},
	'text.$.edition.slug': {type: String},

	work: {type: Object},
	// 'work.id': { type: ObjectId }, // TODO: objectid type?
	'work.slug': {type: String},

	subwork: {type: Object},
	'subwork.title': {type: String},
	'subwork.n': {type: Number},

	// entities: [] // TODO:

// "commentary" : [ ],
// 	"scansion" : [ ],
// 	"media" : [ ],
// 	"definitions" : [ ],
// 	"translations" : [ ],
// 	"articles" : [ ],

	related_passages: {type: [Object]},
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

TextNodes.attachSchema(Schemas.TextNodes);
