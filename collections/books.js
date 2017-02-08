this.Books = new Meteor.Collection('books');

Schemas.Books = new SimpleSchema({
  title: {
    type: String
  },
  books: {
    type: [Object]
  },
  "books.$.url": {
    type: String
  },
  commentarIds: {
    type: [String],
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

Books.attachSchema(Schemas.Books);
Books.attachBehaviour('timestampable');
