export const ADD_COMMENT = 'ADD_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';

export const addComment = ({ comment }) => {
  return {
    type: ADD_COMMENT,
		comment: comment,
  };
}

export const updateComment = ({ comment }) => {
  return {
    type: UPDATE_COMMENT,
		comment: comment,
  };
}

export const removeComment = ({ comment }) => {
  return {
    type: REMOVE_COMMENT,
		comment: comment,
  };
}
