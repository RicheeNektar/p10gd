import { configureStore } from '@reduxjs/toolkit';
import GameListReducer from '../features/game-list/GameList.slice';
import CreateGameReducer from '../features/create-game/CreateGame.slice';
import GameStatsSlice from '../features/game-stats/GameStats.slice';
import RoundOverSlice from '../features/round-over/RoundOver.slice';
import ExportSlice from '../features/export-games/Export.slice';
import ImportSlice from '../features/import-games/Import.slice';

const preloadedState = JSON.parse(localStorage.getItem('p10gd') ?? '{}');

export const store = configureStore({
  preloadedState,
  reducer: {
    gameList: GameListReducer,
    createGame: CreateGameReducer,
    gameStats: GameStatsSlice,
    roundOver: RoundOverSlice,
    export: ExportSlice,
    import: ImportSlice,
  },
});

store.subscribe(() => {
  localStorage.setItem('p10gd', JSON.stringify(store.getState()));
})
