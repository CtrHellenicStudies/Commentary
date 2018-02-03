const serializeLemmaCitationToUrn = (value) => {
	let result = 'urn:cts';

	if ('corpus' in value && value.corpus && value.corpus.length) {
		result = `${result}:${value.ctsNamespace}`;
	} else {
		return result;
	}

	if ('textGroup' in value && value.textGroup && value.textGroup.length) {
		result = `${result}:${value.textGroup}`;
	} else {
		return result;
	}

	if ('work' in value && value.work && value.work.length) {
		result = `${result}.${value.work}`;
	} else {
		return result;
	}

	if ('version' in value && value.version && value.version.length) {
		result = `${result}.${value.version}`;
		if ('exemplar' in value && value.exemplar && value.exemplar.length) {
			result = `${result}.${value.exemplar}`;
			if ('translation' in value && value.translation && value.translation.length) {
				result = `${result}.${value.translation}`;
			} else {
				return result;
			}
		} else {
			return result;
		}
	} else {
		return result;
	}


	if ('passageFrom' in value && value.passageFrom && value.passageFrom.length) {
		result = `${result}:${value.passageFrom.join('.')}`;
		if ('passageTo' in value && value.passageTo && value.passageTo.length) {
			result = `${result}-${value.passageTo.join('.')}`;
		}
	}

	return result;
};

const serializeLemmaCitationToWorkUrn = (value) => {
	let result = 'urn:cts';

	if ('corpus' in value && value.corpus && value.corpus.length) {
		result = `${result}:${value.ctsNamespace}`;
	} else {
		return result;
	}

	if ('textGroup' in value && value.textGroup && value.textGroup.length) {
		result = `${result}:${value.textGroup}`;
	} else {
		return result;
	}

	if ('work' in value && value.work && value.work.length) {
		result = `${result}.${value.work}`;
	} else {
		return result;
	}

	if ('version' in value && value.version && value.version.length) {
		result = `${result}.${value.version}`;
		if ('exemplar' in value && value.exemplar && value.exemplar.length) {
			result = `${result}.${value.exemplar}`;
			if ('translation' in value && value.translation && value.translation.length) {
				result = `${result}.${value.translation}`;
			} else {
				return result;
			}
		} else {
			return result;
		}
	} else {
		return result;
	}

	return result;
};


export default serializeLemmaCitationToUrn;
export { serializeLemmaCitationToWorkUrn };
