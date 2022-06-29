import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  games: [],
  deleteModalFor: -1,
  gameSelectionModalVisible: false,
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
      console.log(playerData);
      state.games[gameId].history.push(playerData);
    },
    ovewriteGames: (state, { payload }) => {
      state.games = payload;
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
} = slice.actions;

export default slice.reducer;
