import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * Tenants represent the individual commentaries hosted by the multi-tenant
 * commentary application, based on subdomain; so ahcip.chs.harvard.edu accesses
 * one tenant and pindar.chs.harvard.edu accesses another tenant
 * @type {Meteor.Collection}
 */
const Tenants = new Meteor.Collection('tenants');

/**
 * Tenants schema
 * @type {SimpleSchema}
 */
Tenants.schema = new SimpleSchema({
	subdomain: {
		type: String
	},
	isAnnotation: {
		type: Boolean,
	}
});

Tenants.attachSchema(Tenants.schema);

export default Tenants;
