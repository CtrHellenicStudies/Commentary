const Metafields = new Meteor.Collection('metafields');

Metafields.schema = new SimpleSchema({
  key: {
    type: String
  },
  value: {
    type: String
  },
});

Metafields.attachSchema(Metafields.schema);

export default Metafields;
