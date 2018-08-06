import defaultWorksEditions from './defaultWorksEditions';
import getCurrentSubdomain from '../../../lib/getCurrentSubdomain';
import { parseValueUrn } from '../../cts/lib/parseUrn';

/**
 * Create a query for mongo from the comment filters array
 */
const createQueryFromFilters = (filters) => {
	const query = {};
	let values = [];
	if (filters) {
		filters.forEach((filter) => {
			switch (filter.key) {
			case '_id':
				// query._id = filter.values[0];
				query.$or = [{_id: filter.values[0]}];
				break;
			case 'textsearch':
				query.$text = {
					$search: filter.values[0],
				};
				break;
			case 'keyideas':
			case 'keywords':
				values = [];
				filter.values.forEach((value) => {
					values.push(value.slug);
				});
				query['keywords.slug'] = {
					$in: values,
				};
				break;

			case 'commenters':
				values = [];
				filter.values.forEach((value) => {
					values.push(value.slug);
				});
				query['commenters.slug'] = {
					$in: values,
				};
				break;

			case 'reference':
				values = [];
				filter.values.forEach((value) => {
					values.push(value._id);
				});
				query['referenceWorks.referenceWorkId'] = {
					$in: values,
				};
				break;

			case 'works':
				const subdomain = getCurrentSubdomain();
				const tenantWorks = defaultWorksEditions[subdomain].works;
				const ctsNamespaces = [];
				const textGroups = [];
				const works = [];

				filter.values.forEach((value) => {
					tenantWorks.forEach(tenantWork => {
						if (tenantWork.slug === value.slug) {
							const workUrn = parseValueUrn(tenantWork.urn);

							if (~!ctsNamespaces.indexOf(workUrn.ctsNamespace)) {
								ctsNamespaces.push(workUrn.ctsNamespace);
							}
							if (~!textGroups.indexOf(workUrn.textGroup)) {
								textGroups.push(workUrn.textGroup);
							}
							if (~!works.indexOf(workUrn.work)) {
								works.push(workUrn.work);
							}
						}
					});
				});

				query['lemmaCitation.ctsNamespace'] = {
					$in: ctsNamespaces,
				};
				query['lemmaCitation.textGroup'] = {
					$in: textGroups,
				};
				query['lemmaCitation.work'] = {
					$in: works,
				};
				break;

			case 'wordpressId':
				// Values will always be an array with a length of one
				query.wordpressId = filter.values[0];
				break;

			case 'urn':
				// Values will always be an array with a length of one
				if (!query.$or) {
					query.$or = [{'urn.v2': filter.values[0]}, {'urn.v1': filter.values[0]}];
				} else {
					query.$or.push({$and: [{ 'urn.v2': filter.values[0] }, {'urn.v1': filter.values[0]}]});
				}
				break;

			default:
				break;
			}
		});
	}

	return query;
};

/**
 * Transfrom the filters to a query to pass to the graphql endpoint for querying
 * comments
 */
const getCommentsQuery = (filters, tenantId, locationUrn) => {
	const query = createQueryFromFilters(filters);
	if ('$text' in query) {
		const textsearch = new RegExp(query.$text, 'i');
		if (!query.$or) {
			query.$or = [
				{ 'revisions.title': textsearch },
				{ 'revisions.text': textsearch },
			];
		} else {
			query.$or.push({$and: [
				{ 'revisions.title': textsearch },
				{ 'revisions.text': textsearch }]});
		}
		delete query.$text;
	}

	if (locationUrn) {
		query.locationUrn = locationUrn;
	}

	query.tenantId = tenantId;
	return JSON.stringify(query);
}

export default getCommentsQuery;
