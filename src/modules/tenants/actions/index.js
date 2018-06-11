/**
 * Actions for dealing with setting and getting the tenantId by subdomain
 */
export const SET_TENANT_ID = 'SET_TENANT_ID';

export const setTenantId = (tenantId) => ({
	type: SET_TENANT_ID,
	tenantId,
});
