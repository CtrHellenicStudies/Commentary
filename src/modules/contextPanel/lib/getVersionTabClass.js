
/**
 * Get the class for the version tab
 */
const getVersionTabClass = (selectedLemmaVersion, lemmaTextVersion, index) => {
	const normalClass = 'version-tab tab';
	const selectedClass = 'version-tab tab selected-version-tab';

	if (!selectedLemmaVersion && index === 0) return selectedClass;
	if (selectedLemmaVersion.id === lemmaTextVersion.id) return selectedClass;
	return normalClass;
};

export default getVersionTabClass;
