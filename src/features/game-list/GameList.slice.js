import { createSlice } from '@reduxjs/toolkit';
import { sha256 } from 'js-sha256';

const initialState = {
  games: [],
  deleteModalFor: -1,
  gameSelectionModalVisible: false,
  guid: -1,
};

const slice = createSlice({
  name: 'GameList',
  initialState,
  reducers: {
    createGame: (state, { payload: playerNames }) => {
      state.games.push({
        time: new Date(),
        players: playerNames,
        history: [],
      });
    },
    deleteGame: state => {
      state.games.splice(state.deleteModalFor, 1);
      state.deleteModalFor = -1;
    },
    showDeleteModal: (state, { payload: gameId }) => {
      state.deleteModalFor = gameId;
    },
    setGameSelectionModalVisible: (state, { payload: visible }) => {
      state.gameSelectionModalVisible = visible;
    },
    addHistoryEntry: (state, { payload: { gameId, playerData } }) => {
      state.games[gameId].history.push(playerData);
    },
    ovewriteGames: (state, { payload }) => {
      state.games = payload;
    },
    genGuid: state => {
      state.guid = sha256(`${new Date()}|p10gd`);
    },
  },
});

export const {
  createGame,
  deleteGame,
  showDeleteModal,
  setGameSelectionModalVisible,
  addHistoryEntry,
  ovewriteGames,
  genGuid,
} = slice.actions;

export default slice.reducer;
