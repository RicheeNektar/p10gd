import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  names: ["","","","","",""],
  errors: [],
  modalVisible: false,
};

const slice = createSlice({
  name: "CreateGame",
  initialState,
  reducers: {
    setModalVisible: (state, { payload: visible }) => {
      state.modalVisible = visible;
    },
    setPlayerName: (state, { payload: { id, name } }) => {
      state.names[id] = name;
    },
    resetForm: (state) => {
      Object.keys(initialState).forEach(key => state[key] = initialState[key]);
    },
    setFormError: (state, {payload: error}) => {
      const errors = [];
      errors.push(error);
      state.errors = errors;
    }
  },
});

export const { setModalVisible, setPlayerName, resetForm, setFormError } = slice.actions;

export default slice.reducer;
