export const ADD_TEXTNODE = 'ADD_TEXTNODE';
export const UPDATE_TEXTNODE = 'UPDATE_TEXTNODE';

export const addTextNode = ({ textNode }) => {
  return {
    type: ADD_TEXTNODE,
		textNode,
  };
}

export const updateTextNode = ({ textNode }) => {
  return {
    type: UPDATE_TEXTNODE,
		textNode,
  };
}

export const removeTextNode = ({ textNode }) => {
  return {
    type: REMOVE_TEXTNODE,
		textNode,
  };
}
