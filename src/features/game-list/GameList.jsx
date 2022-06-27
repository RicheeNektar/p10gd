import React, { Fragment, useState } from 'react';
import { setModalVisible } from '../create-game/CreateGame.slice';
import {
  ListGroup,
  Modal,
  ModalTitle,
  ModalFooter,
  ModalBody,
  Button,
  CloseButton,
  ModalHeader,
  PageItem,
  Pagination,
  Card,
  Alert,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  setGameSelectionModalVisible,
  showDeleteModal,
  deleteGame,
} from './GameList.slice';
import { setSelectedGame } from '../game-stats/GameStats.slice';
import CardHeader from 'react-bootstrap/esm/CardHeader';
import { InfoCircleFill } from 'react-bootstrap-icons';

const GameList = () => {
  const dispatch = useDispatch();
  const deleteModalVisible = useSelector(
    state => state.gameList.deleteModalFor
  );
  const games = useSelector(state => state.gameList.games);
  const gameSelectionModalVisible = useSelector(
    state => state.gameList.gameSelectionModalVisible
  );

  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(games.length / itemsPerPage) - 1;

  const handlePageScroll = targetPage => {
    setPage(Math.max(Math.min(totalPages, targetPage), 0));
  };

  return (
    <Fragment>
      <Modal show={deleteModalVisible > -1}>
        <ModalHeader>
          <ModalTitle>Are you sure?</ModalTitle>
        </ModalHeader>
        <ModalBody>Are you sure you want to delete this game?</ModalBody>
        <ModalFooter>
          <Button variant="danger" onClick={() => {
            dispatch(setSelectedGame(-1));
            dispatch(deleteGame());
          }}>
            Delete
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              dispatch(showDeleteModal(-1));
              dispatch(setGameSelectionModalVisible(true));
            }}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal show={gameSelectionModalVisible}>
        <ModalHeader>
          <ModalTitle>Game</ModalTitle>
          <CloseButton
            onClick={() => dispatch(setGameSelectionModalVisible(false))}
          />
        </ModalHeader>
        <ModalBody>
          <ListGroup>
            {games.length > 0 ? (
              games
                .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
                .map((game, i) => (
                  <Card key={i}>
                    <CardHeader>Created: {game.time}</CardHeader>
                    <div className="card-body">
                      <span>Players: {game.players.join(', ')}</span>
                    </div>

                    <div className="card-footer justify-content-end">
                      <ListGroup className="gap-2">
                        <Button
                          onClick={() => {
                            dispatch(setGameSelectionModalVisible(false));
                            dispatch(setSelectedGame(i));
                          }}>
                          Select
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            dispatch(setGameSelectionModalVisible(false));
                            dispatch(showDeleteModal(i));
                          }}>
                          Delete
                        </Button>
                      </ListGroup>
                    </div>
                  </Card>
                ))
            ) : (
              <Alert variant="info" className="d-flex gap-2 align-items-center">
                <InfoCircleFill />
                <div>
                You did not create a game yet.
                </div>
              </Alert>
            )}
          </ListGroup>
          <Pagination className="justify-content-center mt-4">
            <PageItem onClick={() => handlePageScroll(0)}>«--</PageItem>
            <PageItem onClick={() => handlePageScroll(page - 1)}>«</PageItem>
            <PageItem>{page + 1}</PageItem>
            <PageItem onClick={() => handlePageScroll(page + 1)}>»</PageItem>
            <PageItem onClick={() => handlePageScroll(totalPages)}>
              --»
            </PageItem>
          </Pagination>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              dispatch(setGameSelectionModalVisible(false));
              dispatch(setModalVisible(true));
            }}>
            Create game
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default GameList;
