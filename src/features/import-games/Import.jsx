import React from 'react';
import {
  Button,
  CloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setGameSelectionModalVisible } from '../game-list/GameList.slice';
import { setExportModalVisible } from '../export-games/Export.slice';
import { setImportModalVisible } from './Import.slice';
import { QrReader } from 'react-qr-reader';
import { useState } from 'react';

const Export = ({ t }) => {
  const dispatch = useDispatch();
  const show = useSelector(state => state.import.modalVisible);
  const gamesLength = useSelector(state => state.gameList.games?.length);

  const [totalPages, setTotalPages] = useState(0);
  const gameData = [];

  const parseData = () =>
    new Promise(resolve => {
      resolve(
        JSON.parse(Buffer.from(gameData.join(''), 'base64').toString('utf-8'))
      );
    });

  const setDataForPage = (page, data) => {
    gameData[page] = data;
    parseData()
      .then(data => {
        console.log(data);
      })
      .catch(() => {});
  };
  
  const handleQRData = qrData => {
    if (!qrData) {
      return;
    }

    const { page, qrTotalPages, data } = qrData;

    if (totalPages !== qrTotalPages) {
      setTotalPages(qrTotalPages);
    }

    setDataForPage(page, data);
  };

  const handleClose = () => dispatch(setImportModalVisible(false));

  const handleBack = () => {
    handleClose();
    dispatch(setGameSelectionModalVisible(true));
  };

  const handleExport = () => {
    handleClose();
    dispatch(setExportModalVisible(true));
  };

  return (
    <Modal show={show}>
      <ModalHeader>
        <ModalTitle>{t('import_modal.title')}</ModalTitle>
        <CloseButton onClick={handleClose} />
      </ModalHeader>
      <ModalBody className="justify-content-center">
        {show && (
          <QrReader
            constraints={{
              aspectRatio: 1,
              frameRate: 10,
              facingMode: 'back',
            }}
            onResult={handleQRData}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button disabled={gamesLength === 0} onClick={handleExport}>
          {t('import_modal.export')}
        </Button>
        <Button onClick={handleBack}>{t('import_modal.back')}</Button>
      </ModalFooter>
    </Modal>
  );
};

export default withTranslation()(Export);
