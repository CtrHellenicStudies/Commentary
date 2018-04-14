const serializeUrn = (value, type) => {

	if (!value) {
		return '';
	}
	if (typeof value === 'string') {
		return value;
	}

	let result = 'urn:cts';

	if ('ctsNamespace' in value && value.ctsNamespace && value.ctsNamespace.length) {
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

	// TODO: determine better architecture for class of CTS URN getting only work
	if (type === 'work') {
		return result;
	}

	/** version, exemplar, and translation are optional but must be in order */
	if ('version' in value && value.version && value.version.length) {
		result = `${result}.${value.version}`;
		if ('exemplar' in value && value.exemplar && value.exemplar.length) {
			result = `${result}.${value.exemplar}`;
			if ('translation' in value && value.translation && value.translation.length) {
				result = `${result}.${value.translation}`;
			}
		}
	}

	if ('passage' in value && value.passage && value.passage.length) {
		result = `${result}:`;
		value.passage.forEach((passage, i) => {
			if (i !== 0) {
				result = `${result}-`;
				if (value.passage[0].join('.') === passage.join('.')) {
					return;
				}
			}
			result = `${result}${passage.join('.')}`;
		});
	} else if ('passageFrom' in value && value.passageFrom && value.passageFrom.length) {
		result = `${result}:`;
		if (typeof value.passageFrom[0] === 'number') {
			result = `${result}${value.passageFrom.join('.')}`;
		} else {
			result = `${result}${value.passageFrom[0].join('.')}`;
			if (
				'passageTo' in value
				&& value.passageTo
				&& value.passageTo.length
				&& value.passageFrom[0].join('.') !== value.passageTo[0].join('.')
			) {
				result = `${result}-${value.passageTo[0].join('.')}`;
			}
		}
	}

	return result;
};


export default serializeUrn;
