import * as types from '../actions/bricks';

export default (state = [], action) => {
  switch (action.type) {
    case types.UPDATE_COMMENT:
      return {
				...state,
				comment: action.comment,
			};
    default:
      return state;
  }
};
