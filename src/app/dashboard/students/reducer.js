export const createInitialStateStudentReducer = () => {
  return {
    filter: {
      university: [],
    },
  };
};

export const studentReducer = (state, action) => {
  if (action.type === "filter_table") {
    return {
      filter: action.filter,
    };
  }
  throw Error("unknown action: " + action.type);
};
