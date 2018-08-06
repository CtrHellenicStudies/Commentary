/**
 * Get the context panel text state for editor or comment group
 */
const getContextPanelTextState = (commentGroup, editor) => {
	if (commentGroup) return 'context';
	if (editor) return 'editor';
	return 'default';
};

export default getContextPanelTextState;
