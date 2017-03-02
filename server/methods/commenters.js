import { Meteor } from 'meteor/meteor';
import Commenters from '/imports/collections/commenters';

Meteor.methods({
    'commenters.insert'(data) {
      check(data, Object);

      return Commenters.insert(data);
    },
    'commenters.remove'(commenterId) {
      check(commenterId, String);

      Commenters.remove(commenterId);
    }
});
