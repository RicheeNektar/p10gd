import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedGame: -1,
};

const slice = createSlice({
  initialState,
  name: 'GameStats',
  reducers: {
    setSelectedGame: (state, { payload: id }) => {
      state.selectedGame = id;
    },
  },
});

export const { setSelectedGame } = slice.actions;

export default slice.reducer;
