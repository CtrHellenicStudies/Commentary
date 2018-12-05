
const isValidUrl = (inputStr) => {
	const pattern = new RegExp('^(https?:\/\/)?' + // eslint-disable-line
		'((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|' + // eslint-disable-line
		'((\d{1,3}\.){3}\d{1,3}))' + // eslint-disable-line
		'(\:\d+)?(\/[-a-z\d%_.~+]*)*' + // eslint-disable-line
		'(\?[&a-z\d%_.~+=-]*)?' + // eslint-disable-line
		'(\#[-a-z\d_]*)?$', 'i'); // eslint-disable-line

	if (!pattern.test(inputStr)) {
		return false;
	}

	return true;
}

export default isValidUrl;
