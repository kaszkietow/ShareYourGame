// src/store/userReducer.js

const SET_USER = 'SET_USER';
const CLEAR_USER = 'CLEAR_USER';

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});

const initialState = {
  currentUser: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, currentUser: action.payload };
    case CLEAR_USER:
      return { ...state, currentUser: null };
    default:
      return state;
  }
};

export default userReducer;
