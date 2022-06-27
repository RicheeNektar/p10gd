import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayerName, resetForm, setFormError } from './CreateGame.slice';
import { createGame, setGameSelectionModalVisible } from '../game-list/GameList.slice';
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

const ERROR_INVALID_PLAYER_COUNT = 'At least 2 player names are required.';

const CreateGame = () => {
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
          <label>Player {i + 1}'s name</label>
        </Col>
        <Col>
          <input
            name={`player-${i}`}
            type="text"
            placeholder={`Player ${i + 1}`}
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
    const names = playerNames.filter(name => name.match(/\w/));

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
        <ModalTitle>Create a new game:</ModalTitle>
      </ModalHeader>
      <ModalBody>
        {formErrors.length > 0 && (
          <Alert variant="danger" key="errors">
            <h4>You have errors:</h4>
            <ul>
              {formErrors.map((error, i) => (
                <li key={i}>{error}</li>
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
          }}>
          Cancel
        </Button>
        <Button key="continue" type="submit" onClick={handleSubmit}>
          Create
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateGame;
