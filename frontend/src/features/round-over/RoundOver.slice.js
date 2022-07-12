import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formStore: [],
  visible: false,
  errors: [],
};

const slice = createSlice({
  name: "RoundOver",
  initialState,
  reducers: {
    showRoundOverModal: (state, {payload: playerCount}) => {
      state.formStore = [];
      state.visible = true;

      for (let i = 0; i < playerCount; i++) {
        state.formStore.push({
          points: 0,
          phase: false,
        });
      }
    },
    cancelRoundOver: state => {
      Object.keys(initialState).forEach(key => state[key] = initialState[key]);
    },
    setPoints: (state, {payload: {playerId, points}}) => {
      state.formStore[playerId].points = points;
    },
    setPhase: (state, {payload: {playerId, phase}}) => {
      state.formStore[playerId].phase = phase;
    },
    setError: (state, {payload: {playerId, id}}) => {
      if (!state.errors[playerId]) {
        state.errors[playerId] = {
          points: false,
        };
      }

      state.errors[playerId][id] = true;
    },
    clearErrors: state => {
      state.errors = initialState.errors;
    },
  },
});

export const { showRoundOverModal, setPoints, setPhase, cancelRoundOver, setError, clearErrors } = slice.actions;

export default slice.reducer;
