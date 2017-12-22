import TextNodes from '/imports/models/textNodes';
import Editions from '/imports/models/editions';

function checkIfEditionUnique(edition) {
	const foundEdition = Editions.findOne({ slug: edition.slug });
	if (foundEdition) return false;
	return true;
}

function createEditions(createEditionsResolve, createEditionsReject) {

	console.log('BEGIN createEditions');

	// get distinct editions in text nodes
	const distinctEditionsPromise = TextNodes.rawCollection().distinct('text.edition');

	// handle promise
	distinctEditionsPromise.then((distinctEditions) => {

		// log found distinct editions
		console.log('distinctEditions', distinctEditions);

		const editionInsertPromises = [];

		// loop through distinct editions
		distinctEditions.forEach((edition) => {

			if (typeof edition === 'object') {
				
				// check if edition is unique
				const editionUnique = checkIfEditionUnique(edition);

				// insert new edition if unique
				if (editionUnique) {
					editionInsertPromises.push(new Promise((resolve, reject) => {
						Editions.insert(edition, (err, _id) => {
							if (err) {
								console.error(err);
								reject(err);
							} else {
								console.log(`New edition added, _id: ${_id}`);
								resolve(_id);
							}
						});
					}));
				}
			}
		});

		// resolve when all inserts complited successfully
		Promise.all(editionInsertPromises).then((_idArray) => {
			console.log('All new editions inserted:', _idArray);
			createEditionsResolve(_idArray);
		}, (error) => {
			console.error('Error returned on Edition insert:', error);
			createEditionsReject(error);
		});
	});
}

function updateTextNodes() {

	console.log('BEGIN updateTextNodes');

	// find all text nodes
	const allTextNodes = TextNodes.find();

	// loop through all text nodes
	allTextNodes.forEach((textNode) => {

		const newTextNode = textNode;

		// loop through texts in text nodes
		newTextNode.text.forEach((text, i) => {
			if (text.edition && text.edition.slug) {

				// find matching edition
				const edition = Editions.findOne({ slug: text.edition.slug });

				// if edition found update newTextNode object
				if (edition && edition._id) {
					newTextNode.text[i].edition = edition._id;
				} else throw new Error('Edition not found');
			}
		});

		// update text node doc
		TextNodes.update({ _id: newTextNode._id }, { $set: { text: newTextNode.text } }, (err, num) => {
			if (err) console.error(err);
			else if (num > 0) console.log(`Text Node edition updated, _id: ${newTextNode._id}`);
			else console.warn(`Text Node (_id: ${newTextNode._id}) not found`);
		});
	});

	console.log('FINISHED updateTextNodes');
}

function fixTextNodesEditions() {
	console.log('BEGIN fixTextNodesEditions');
	const createEditionsPromise = new Promise(createEditions);
	createEditionsPromise.then((_idArray) => {
		console.log('createEditions SUCCESSFUL');
		updateTextNodes();
	}, (error) => {
		console.error('createEditions FAILED');
		console.error('fixTextNodesEditions FAILED');
	});
}

export default fixTextNodesEditions;
