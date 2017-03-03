import { Meteor } from 'meteor/meteor';
import Books from '/imports/collections/books';

Meteor.methods({
    'books.insert'(data) {
      check(data, Object);

      return Books.insert(data);
    },
    'books.remove'(bookId) {
      check(bookId, String);

      Books.remove(bookId);
    }
});
