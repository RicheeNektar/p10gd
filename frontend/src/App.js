import React, { useEffect } from 'react';
import CreateGame from './features/create-game/CreateGame';
import GameList from './features/game-list/GameList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container } from 'react-bootstrap';
import GameStats from './features/game-stats/GameStats';
import { useDispatch, useSelector } from 'react-redux';
import { setGameSelectionModalVisible, setGuid } from './features/game-list/GameList.slice';
import RoundOver from './features/round-over/RoundOver';
import { showRoundOverModal } from './features/round-over/RoundOver.slice';
import { withTranslation } from 'react-i18next';
import Export from './features/export-games/Export';
import Import from './features/import-games/Import';
import 'webrtc-adapter';

const App = ({ t }) => {
  const dispatch = useDispatch();
  const selectedGame = useSelector(state => state.gameStats.selectedGame);
  const guid = useSelector(state => state.gameList.guid);
  const game = useSelector(
    state => state.gameList.games[selectedGame]
  );

  const showImportModal = useSelector(state => state.import.modalVisible);
  const showExportModal = useSelector(state => state.export.modalVisible);

  useEffect(() => {
    if (guid === null) {
      const key = (Math.random() * 10000000 * Math.random()).toFixed(0);
      dispatch(setGuid(key));
    }
  }, []);

  return (
    <Container className="mt-2">
      <h1 className="text-center mx-auto w-75">
        {t('app.title')}
      </h1>
      {showImportModal && <Import />}
      {showExportModal && <Export />}
      <RoundOver />
      <CreateGame />
      <GameList />
      <div className="d-flex gap-2 justify-content-center my-2">
        <Button
          onClick={() => {
            if (selectedGame > -1) {
              dispatch(showRoundOverModal(game.players.length));
            }
          }}
          disabled={selectedGame === -1}>
          {t('app.round_over')}
        </Button>
        <Button onClick={() => dispatch(setGameSelectionModalVisible(true))}>
          {t('app.show_games')}
        </Button>
      </div>
      <GameStats />
    </Container>
  );
};

export default withTranslation()(App);
