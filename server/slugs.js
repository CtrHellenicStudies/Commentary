/* Meteor.startup(() => {
 let count;
 const docs = Commenters.find({
 slug: {
 $exists: false,
 },
 }, {
 limit: 500,
 });
 count = 0;
 docs.forEach((doc) => {
 Commenters.update({
 _id: doc._id,
 }, {
 $set: {
 },
 });
 count += 1;
 return count;
 });
 return console.log(`Updated slugs for ${count} Commenters.`);
 });
 */
