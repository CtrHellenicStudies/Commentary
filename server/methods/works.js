import { Meteor } from 'meteor/meteor';
import Works from '/imports/collections/works';

Meteor.methods({
    'works.insert'(data) {
      check(data, Object);

      return Works.insert(data);
    },
    'works.remove'(bookId) {
      check(bookId, String);

      Works.remove(bookId);
    }
});
