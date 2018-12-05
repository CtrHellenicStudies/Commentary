import winston from 'winston';


const resolveUrnVersion = (urn) => {
	let ret = urn;
	try {
		if (urn.v2) {
			ret = urn.v2;
		} else {
			ret = urn.v1;
		}

	} catch (error) {
		winston.error('Old urn exists in database.');
	}
	return ret;
};


export default resolveUrnVersion;
