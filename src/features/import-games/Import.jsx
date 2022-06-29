import React from 'react';
import {
  Alert,
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
import { ovewriteGames, setGameSelectionModalVisible } from '../game-list/GameList.slice';
import { setExportModalVisible } from '../export-games/Export.slice';
import {
  resetPageData,
  setImportModalVisible,
  setPageData,
} from './Import.slice';
import { QrReader } from 'react-qr-reader';
import { useState } from 'react';
import { gunzipSync } from 'react-zlib-js';
import { Buffer } from 'buffer';
import { useEffect } from 'react';
import { CheckCircleFill, ExclamationTriangleFill } from 'react-bootstrap-icons';
import AlertIcon from '../../components/AlertIcon';
import { setSelectedGame } from '../game-stats/GameStats.slice';

const Export = ({ t }) => {
  const dispatch = useDispatch();
  const show = useSelector(state => state.import.modalVisible);
  const gamesLength = useSelector(state => state.gameList.games?.length);
  const gameData = useSelector(state => state.import.importData);

  const readPages = gameData.slice().filter(i => i !== null).length;

  const [message, setMessage] = useState(null);
  const [totalPages, setTotalPages] = useState(-1);

  const videoVisible = totalPages === -1 || readPages - 1 !== totalPages;

  useEffect(() => {
    dispatch(resetPageData());
  }, []);

  const parseData = () =>
    JSON.parse(
      gunzipSync(Buffer.from(gameData.join(''), 'base64')).toString('utf-8')
    );

  const handleQRData = qrData => {
    if (!qrData) {
      return;
    }

    const { page, totalPages: qrTotalPages, data } = JSON.parse(qrData);

    setMessage({
      key: 'import_modal.read_status.success',
      params: { page: page + 1 },
      variant: 'success',
    });

    if (totalPages !== qrTotalPages) {
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

  const handleOverwrite = () => {
    try {
      const d = parseData();
      handleClose();
      dispatch(setSelectedGame(-1));
      dispatch(ovewriteGames(d));
      dispatch(resetPageData());
    } catch (e) {
      setMessage({
        variant: 'danger',
        key: 'import_modal.import_error',
      });
    }
  };

  return (
    <Modal show={show}>
      <ModalHeader>
        <ModalTitle>{t('import_modal.title')}</ModalTitle>
        <CloseButton onClick={handleClose} />
      </ModalHeader>
      <ModalBody className="justify-content-center">
        <AlertIcon variant="warning"><ExclamationTriangleFill />{t('import_modal.save_game_warning')}</AlertIcon>
        {message && <AlertIcon variant={message.variant}><CheckCircleFill /> {t(message.key, message.params)}</AlertIcon>}
        <p>
          {t('import_modal.page_progress', {readPages, count: totalPages + 1})}
        </p>
        {videoVisible && (
          <QrReader
            constraints={{
              aspectRatio: 1,
              frameRate: 10,
              facingMode: 'environment',
            }}
            onResult={handleQRData}
          />
        )}
        {!videoVisible && <Button onClick={handleOverwrite}>{t('import_modal.action.overwrite')}</Button>}
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
