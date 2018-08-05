import qs from 'qs-lite';
import _s from 'underscore.string';

// lib
import PageMeta from '../../../lib/pageMeta';
import {
	createFiltersFromQueryParams,
} from './queryFilterHelpers';

/**
 * Set page title and meta
 */
const setPageTitleAndMeta = (settings, commentGroups, worksQuery) => {
	let title = '';
	let values = [];
	const workDefault = 'Commentary';
	let work = '';
	let passage = '';
	let metaSubject = 'Commentaries on Classical Texts';
	let description = '';
	const queryParams = qs.parse(window.location.search.replace('?', ''));
	const filters = createFiltersFromQueryParams(queryParams);


	// if no settings available, do not set page metadata
	if (!settings) {
		return null;
	}

	filters.forEach((filter) => {
		values = [];
		switch (filter.key) {
		case 'works':
			filter.values.forEach((value) => {
				values.push(value.slug);
			});
			work = values.join(', ');
			break;

		case 'passage':
			passage = filter.values[0];
			break;
		default:
			break;
		}
	});

	const foundWork = worksQuery.loading ? {} : worksQuery.works.find(x => x.slug === work)
	if (foundWork) {
		title = foundWork.title;
	} else {
		title = workDefault;
	}

	if (passage) {
		title = `${title}.${passage}`;
	}

	title = `${title} | ${settings.title || ''}`;

	metaSubject = `${metaSubject}, ${title}, Philology`;

	if (
		commentGroups.length
		&& commentGroups[0].comments.length
		&& commentGroups[0].comments[0].revisions.length
	) {
		description = _s.truncate(commentGroups[0].comments[0].revisions[0].text, 120);
	}

	PageMeta.setMetaTag('name', 'subject', 'content', metaSubject);
	PageMeta.setTitle(title);
	PageMeta.setDescription(`Commentary on ${title}: ${description}`);
	PageMeta.setMetaImage();
};

export default setPageTitleAndMeta;
