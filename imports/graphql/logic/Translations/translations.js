import TranslationNodes from '/imports/models/translationNodes';
import Works from '/imports/models/works';
import { Meteor } from 'meteor/meteor';
import GraphQLService from '../graphQLService';

/**
 * Logic-layer service for dealing with translations
 */
export default class TranslationsService extends GraphQLService {

	/**
	 * DEPRECATED
	 * Get translations
	 * @param {string} tenantId - id of current tenant
	 * @returns {Object[]} array of translations 
	 */
	translationGet(tenantId) {
		const args = {};

		if (tenantId) {
			args.tenantId = tenantId;
		}

		return TranslationNodes.find(args).fetch();
	}
	getAuthors(work, subwork) {

		if (!work || !subwork) {
			return [];
		}
		const workSlug = Works.findOne(work).slug;
		const translations = TranslationNodes.find({work: workSlug, subwork: parseInt(subwork)}).fetch();
		const authors = {};
		const ret = [];
		for (let i = 0; i < translations.length; i++) {
			if (!authors[translations[i].author]) {
				authors[translations[i].author] = true;
				ret.push(translations[i]);
			}
		}
		return ret;
	}
	translationUpdate(translationNode) {

		if (this.userIsNobody) {
			return new Error('Not authorized');
		}
		if (!translationNode.n)	{ 
			return; 
		}
		const query = {
			author: translationNode.author,
			n: translationNode.n,
			subwork: translationNode.subwork,
			work: translationNode.work
		};
		delete translationNode._id;
	
		return TranslationNodes.upsert(query, {$set: translationNode});
	}
	translationUpdateAuthor() {
		if (this.userIsNobody) {
			return new Error('Not authorized');
		}
	}
	translationAddAuthor(workDetails, authorName) {
		if (this.userIsNobody) {
			return new Error('Not authorized');
		}
			// TODO: remove this after changing to workId instead of a slug
		const workSlug = Works.findOne(workDetails.work).slug;
	
		const newAuthor = Object.assign({}, workDetails, {author: authorName, work: workSlug});
		console.log(newAuthor);
	
		return TranslationNodes.insert(newAuthor);
	}
	/**
	 * Remove selected translation node
	 * @param {String} id - translationNode id 
	 */
	translationRemove(id) {
		if (this.userIsNobody) {
			return new Error('Not authorized');
		}
		return TranslationNodes.remove(id);
	}
}
