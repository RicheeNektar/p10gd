import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalVisible: false,
};

const slice = createSlice({
  name: "Export",
  initialState,
  reducers: {
    setExportModalVisible: (state, { payload: visible }) => {
      state.modalVisible = visible;
    },
  },
});

export const { setExportModalVisible } = slice.actions;

export default slice.reducer;
