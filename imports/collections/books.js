const Books = new Meteor.Collection('books');

Books.schema = new SimpleSchema({
  title: {
    type: String
  },
  books: {
    type: [Object]
  },
  "books.$.url": {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
  commentarIds: {
    type: [String],
    optional: true,
    autoform: {
      type: "select-multiple",
      label: "Commentators",
      options: function () {
        let options = [];
        let users = Meteor.users.find().fetch();
        _.map(users, (user) => {
          options.push({label: user.emails? user.emails[0].address : user.username, value: user._id});
        });
        return options;
      }
    }
  }
});

Books.attachSchema(Books.schema);
Books.attachBehaviour('timestampable');

export default Books;
