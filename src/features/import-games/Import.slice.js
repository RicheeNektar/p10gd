import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalVisible: false,
  importData: [],
};

const slice = createSlice({
  name: "Import",
  initialState,
  reducers: {
    setImportModalVisible: (state, { payload: visible }) => {
      state.modalVisible = visible;
    },
    setPageData: (state, { payload: { page, data }}) => {
      state.importData[page] = data;
    },
    resetPageData: state => {
      state.importData = [];
    },
  },
});

export const { setImportModalVisible, setPageData, resetPageData } = slice.actions;

export default slice.reducer;
