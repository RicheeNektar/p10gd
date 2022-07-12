import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayerName, resetForm, setFormError } from './CreateGame.slice';
import {
  createGame,
  setGameSelectionModalVisible,
} from '../game-list/GameList.slice';
import Alert from 'react-bootstrap/Alert';
import {
  Col,
  Button,
  Row,
  Modal,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'react-bootstrap';
import { setSelectedGame } from '../game-stats/GameStats.slice';
import { withTranslation } from 'react-i18next';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';

const ERROR_INVALID_PLAYER_COUNT =
  'create_game.form_error.invalid_player_count';

const CreateGame = ({ t }) => {
  const playerNames = useSelector(state => state.createGame.names);
  const formErrors = useSelector(state => state.createGame.errors);
  const createGameModalVisible = useSelector(
    state => state.createGame.modalVisible
  );
  const listLength = useSelector(state => state.gameList.games.length);
  const dispatch = useDispatch();

  const playerNameInputs = [];

  for (let i = 0; i < 6; i++) {
    playerNameInputs.push(
      <Row key={`player-${i}`}>
        <Col>
          <label>{t('create_game.player.label', { number: i + 1 })}</label>
        </Col>
        <Col>
          <input
            name={`player-${i}`}
            type="text"
            placeholder={t('create_game.player.placeholder', { number: i + 1 })}
            onChange={e =>
              dispatch(setPlayerName({ id: i, name: e.target.value }))
            }
            value={playerNames[i]}
          />
        </Col>
      </Row>
    );
  }

  const handleSubmit = e => {
    const names = playerNames.map(n => n.trim()).filter(name => name.match(/\w/));

    switch (names.length) {
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        dispatch(resetForm());
        dispatch(createGame(names));
        dispatch(setSelectedGame(listLength));
        break;
      default:
        dispatch(setFormError(ERROR_INVALID_PLAYER_COUNT));
        break;
    }
  };

  return (
    <Modal show={createGameModalVisible}>
      <ModalHeader>
        <ModalTitle>{t('create_game.modal_title')}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        {formErrors.length > 0 && (
          <Alert variant="danger">
            <div className="d-flex align-items-center gap-2">
              <ExclamationTriangleFill />{' '}
              <b>{t('create_game.form_error', { count: formErrors.length })}</b>
            </div>
            <ul>
              {formErrors.map((error, i) => (
                <li key={i}>{t(error)}</li>
              ))}
            </ul>
          </Alert>
        )}
        <Col key="names">{playerNameInputs}</Col>
      </ModalBody>
      <ModalFooter>
        <Button
          className="align-self-start"
          key="cancel"
          variant="danger"
          type="button"
          onClick={() => {
            dispatch(resetForm());
            dispatch(setGameSelectionModalVisible(true));
          }}
        >
          {t('create_game.action.cancel')}
        </Button>
        <Button key="continue" type="submit" onClick={handleSubmit}>
          {t('create_game.action.create')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default withTranslation()(CreateGame);
