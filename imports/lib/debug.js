/**
 * Add debug settings to SimpleSchema
 */
if (process.env.NODE_ENV === 'development') {
	SimpleSchema.debug = true;
}
