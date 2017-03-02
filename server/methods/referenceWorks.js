import { Meteor } from 'meteor/meteor';
import ReferenceWorks from '/imports/collections/referenceWorks';

Meteor.methods({
    'referenceWorks.insert'(data) {
      check(data, Object);

      return ReferenceWorks.insert(data);
    },
    'referenceWorks.remove'(referenceWorkId) {
      check(referenceWorkId, String);

      ReferenceWorks.remove(referenceWorkId);
    }
});
