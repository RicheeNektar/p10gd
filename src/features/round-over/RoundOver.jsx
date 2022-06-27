import {
  Button,
  Card,
  CardGroup,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Row,
} from 'react-bootstrap';
import CardHeader from 'react-bootstrap/esm/CardHeader';
import { useDispatch, useSelector } from 'react-redux';
import {
  addHistoryEntry,
} from '../game-list/GameList.slice';
import {
  setPhase,
  setPoints,
  cancelRoundOver,
  setError,
  clearErrors,
} from './RoundOver.slice';

const RoundOver = () => {
  const dispatch = useDispatch();

  const roundOverVisible = useSelector(state => state.roundOver.visible);
  const selectedGameId = useSelector(state => state.gameStats.selectedGame);
  const selectedGame = useSelector(
    state => state.gameList.games[selectedGameId]
  );
  const formErrors = useSelector(state => state.roundOver.errors);
  const formStore = useSelector(state => state.roundOver.formStore);

  if (!selectedGame) {
    return null;
  }

  const playerInputs = selectedGame.players.map((name, id) => {
    const phaseInput = `phase-${id}`;
    const pointsInput = `points-${id}`;

    const playerErrors = formErrors[id];

    return (
      <Card key={id} className={playerErrors && 'border-danger'}>
        <CardHeader>{name}</CardHeader>
        <div className="card-body">
          <Row>
            <Col>
              <label htmlFor={pointsInput}>Points:</label>
            </Col>
            <Col>
              <input
                id={pointsInput}
                name={pointsInput}
                type="number"
                className={`form-control ${
                  playerErrors?.points && 'is-invalid'
                }`}
                placeholder="0 - 255"
                step="5"
                min="0"
                max="255"
                onChange={e =>
                  dispatch(
                    setPoints({ playerId: id, points: e.target.value })
                  )
                }
                value={formStore[id]?.points ?? 0}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <label htmlFor={phaseInput}>Got phase:</label>
            </Col>
            <Col>
              <input
                id={phaseInput}
                name={phaseInput}
                type="checkbox"
                className="form-check-input"
                onChange={e =>
                  dispatch(
                    setPhase({ playerId: id, phase: e.target.checked })
                  )
                }
                checked={formStore[id]?.phase}
              />
            </Col>
          </Row>
        </div>
      </Card>
    );
  });

  const handleSubmit = e => {
    e.preventDefault();

    dispatch(clearErrors());

    const isValid = selectedGame.players.every((p, id) => {
      const player = formStore[id];
      const points = Number.parseInt(player.points);

      if (points < 0 || points > 255) {
        dispatch(setError({ playerId: id, id: 'points' }));
        return false;
      }

      return true;
    });

    if (isValid) {
      dispatch(
        addHistoryEntry(
          {
            gameId: selectedGameId,
            playerData: formStore.map(p => ({ ...p, points: Number.parseInt(p.points) })),
          }
        )
      );
      dispatch(cancelRoundOver());
    }
  };

  const renderSlice = (start, end) => playerInputs.slice(start, end);

  return (
    <Modal show={roundOverVisible}>
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <ModalTitle>Enter points of Players</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <CardGroup>{renderSlice(0, 2)}</CardGroup>
          <CardGroup>{renderSlice(2, 4)}</CardGroup>
          <CardGroup>{renderSlice(4, 6)}</CardGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            variant="danger"
            onClick={() => dispatch(cancelRoundOver())}>
            Cancel
          </Button>
          <Button type="submit">Apply</Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default RoundOver;
