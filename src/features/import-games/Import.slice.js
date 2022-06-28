import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalVisible: false,
};

const slice = createSlice({
  name: "Import",
  initialState,
  reducers: {
    setImportModalVisible: (state, { payload: visible }) => {
      state.modalVisible = visible;
    },
  },
});

export const { setImportModalVisible } = slice.actions;

export default slice.reducer;
