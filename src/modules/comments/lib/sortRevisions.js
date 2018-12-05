import _ from 'underscore';

const sortRevisions = (revisions) => _.sortBy(revisions, 'created').reverse();

export default sortRevisions;
