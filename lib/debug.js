import {SimpleSchema} from 'meteor/aldeed:simple-schema';

if (process.env.NODE_ENV === 'development') {
	SimpleSchema.debug = true;
}
