import Editions from '/imports/models/editions';
import AdminService from '../adminService';

/**
 * Logic-layer service for dealing with editions
 */
export default class EditionsService extends AdminService {

	/**
	 * Get editions
	 * @param {string} editionId - id of edition
	 * @returns {Object[]} array of editions
	 */
	editionsGet(editionId) {
		const args = {};

		if (editionId) {
			args._id = tenantId;
		}

		return Editions.find(args).fetch();
	}
	/**
	 * Insert edition
	 * @param {object} edition - book edition
	 * @param {string} multiline - multiline text
	 */
	editionInsert(edition, multiline) {

		if (this.userIsNobody) {
			throw new Error('not-authized');
		}
	
		const currentEdition = Editions.findOne(edition._id);
		const currentMultiline = currentEdition.multiLine && currentEdition.multiLine.length ? currentEdition.multiLine : [];
	
		if (currentMultiline.indexOf(multiline) === -1) {
			currentMultiline.push(multiline);
			Editions.update(edition._id, {$set: {multiLine: currentMultiline}});
		} else {
			return new Error('Multiline edition already exists!');
		}
	}
	/**
	 * Remove edition
	 * @param {object} edition - book edition
	 * @param {string} multiline - multiline text
	 */
	editionsRemove(edition, multiline) {

		if (this.userIsNobody) {
			throw new Error('not-authorized');
		}

		const currentEdition = Editions.findOne(edition._id);
		const multilineIndex = currentEdition.multiLine.indexOf(multiline);
		currentEdition.multiLine.splice(multilineIndex, 1);
	
		Editions.update(edition._id, {$set: currentEdition});
	}
}
