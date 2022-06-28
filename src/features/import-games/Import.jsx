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
import { resetPageData, setImportModalVisible, setPageData } from './Import.slice';
import { QrReader } from 'react-qr-reader';
import { useState } from 'react';
import { gunzipSync } from 'react-zlib-js';
import { Buffer } from 'buffer';

const Export = ({ t }) => {
  const dispatch = useDispatch();
  const show = useSelector(state => state.import.modalVisible);
  const gamesLength = useSelector(state => state.gameList.games?.length);
  const gameData = useSelector(state => state.import.importData);
  
  const readPages = gameData.length;

  const [message, setMessage] = useState('');
  const [totalPages, setTotalPages] = useState(-1);

  const parseData = () =>
    JSON.parse(
      gunzipSync(Buffer.from(gameData.join(''), 'base64')).toString('utf-8')
    );

  const setDataForPage = (page, data) => {
    gameData[page] = data;

    if (gameData.length - 1 === totalPages) {
      try {
        console.log(parseData());
      } catch (e) {
        setMessage("An error occurred: " + e.message);
      }
    }
  };

  const handleQRData = qrData => {
    if (!qrData) {
      return;
    }

    const { page, totalPages: qrTotalPages, data } = JSON.parse(qrData);

    setMessage(t('import_modal.read_status.success', { page: page + 1 }));

    if (totalPages !== qrTotalPages) {
      dispatch(resetPageData());
      setTotalPages(qrTotalPages);
    }

    dispatch(setPageData({ page, data }));
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
        <p>{message}</p>
        <p>
          Read {readPages} / {totalPages + 1}
        </p>
        {show && readPages - 1 !== totalPages && (
          <QrReader
            constraints={{
              aspectRatio: 1,
              frameRate: 10,
              facingMode: 'front',
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
