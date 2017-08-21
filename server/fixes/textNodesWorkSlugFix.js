
import TextNodes from '/imports/models/textNodes';

Meteor.method('textNodesWorkSlugFix', () => {
	// ---
	// FIX the work.slug field in the textNodes collection - set work.slug to 'homeric-hymns'
	// ---
	const textNodes = TextNodes.find({ 'work.slug': 'hymns' }).fetch();
	textNodes.forEach((textNode) => {
		try {
			TextNodes.update({ _id: textNode._id }, { $set: { 'work.slug': 'homeric-hymns' } });
			console.log('TextNode with id:', textNode._id, 'wrok.slug changed to homeric-hymns.');
		} catch (err) {
			console.log(err);
		}
	});
	console.log(' -- method texNodesWorkSlugFix run completed');

	return 1;
}, {
	url: 'fix/texNodes/workSlug',
});
