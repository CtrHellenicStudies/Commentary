const Editions = new Meteor.Collection('editions');

Editions.schema = new SimpleSchema({
  title: {
    type: String
  },
  slug: {
    type: String
  }
});

Editions.attachSchema(Editions.schema);
export default Editions;
