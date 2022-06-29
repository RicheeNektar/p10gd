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
  import { withTranslation } from 'react-i18next';
  import { setExportModalVisible } from '../export-games/Export.slice';
  import { setImportModalVisible } from '../import-games/Import.slice';
  import AlertIcon from '../../components/AlertIcon';

  const GameList = ({ t, i18n }) => {
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
            <ModalTitle>{t('game_list.delete_game.modal_title')}</ModalTitle>
          </ModalHeader>
          <ModalBody>{t('game_list.delete_game.text')}</ModalBody>
          <ModalFooter>
            <Button
              variant="danger"
              onClick={() => {
                dispatch(setSelectedGame(-1));
                dispatch(deleteGame());
              }}
            >
              {t('game_list.delete_game.confirm')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                dispatch(showDeleteModal(-1));
                dispatch(setGameSelectionModalVisible(true));
              }}
            >
              {t('game_list.delete_game.cancel')}
            </Button>
          </ModalFooter>
        </Modal>

        <Modal show={gameSelectionModalVisible}>
          <ModalHeader>
            <ModalTitle>{t('game_list.modal_title')}</ModalTitle>
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
                      <CardHeader>
                        {t('game_list.game.created', { time: new Date(game.created).toLocaleString(i18n.language) })}
                      </CardHeader>
                      <div className="card-body">
                        <span>
                          {t('game_list.game.players', { players: game.players.join(', ') })}
                        </span>
                      </div>

                      <div className="card-footer justify-content-end">
                        <ListGroup className="gap-2">
                          <Button
                            onClick={() => {
                              dispatch(setGameSelectionModalVisible(false));
                              dispatch(setSelectedGame(i));
                            }}
                          >
                            {t('game_list.action.select')}
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => {
                              dispatch(setGameSelectionModalVisible(false));
                              dispatch(showDeleteModal(i));
                            }}
                          >
                            {t('game_list.action.delete')}
                          </Button>
                        </ListGroup>
                      </div>
                    </Card>
                  ))
              ) : (
                <AlertIcon variant="info">
                  <InfoCircleFill />
                  <div>{t('game_list.no_games')}</div>
                </AlertIcon>
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
            {games.length > 0 ? (
              <Button
                onClick={() => {
                  dispatch(setGameSelectionModalVisible(false));
                  dispatch(setExportModalVisible(true));
                }}
              >
                {t('game_list.action.export')}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  dispatch(setGameSelectionModalVisible(false));
                  dispatch(setImportModalVisible(true));
                }}
              >
                {t('game_list.action.import')}
              </Button>
            )}

            <Button
              onClick={() => {
                dispatch(setGameSelectionModalVisible(false));
                dispatch(setModalVisible(true));
              }}
            >
              {t('game_list.action.create_game')}
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  };

  export default withTranslation()(GameList);
