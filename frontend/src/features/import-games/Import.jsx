import React, { useEffect, useState } from 'react';
import {
  Button,
  CloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ProgressBar,
  Spinner,
} from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setGameSelectionModalVisible } from '../game-list/GameList.slice';
import { setExportModalVisible } from '../export-games/Export.slice';
import { downloadChunks, setImportModalVisible, reset } from './Import.slice';
import { QrReader } from 'react-qr-reader';
import { ExclamationTriangleFill, InfoCircleFill } from 'react-bootstrap-icons';
import AlertIcon from '../../components/AlertIcon';
import { setSelectedGame } from '../game-stats/GameStats.slice';
import { overwriteGames } from '../game-list/GameList.slice';

const Import = ({ t }) => {
  const dispatch = useDispatch();
  const gamesLength = useSelector(state => state.gameList.games?.length);
  const downloading = useSelector(state => state.import.isDownloading);
  const backup = useSelector(state => state.import.backup);
  const { toDownload, downloaded } = useSelector(state => state.import.status);

  useEffect(() => {
    if (!downloading) {
      dispatch(reset());
    }
  }, []);

  const handleQRData = qrData => {
    if (!qrData) {
      return;
    }

    try {
      dispatch(downloadChunks(JSON.parse(qrData.text)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClose = () => {
    dispatch(setImportModalVisible(false));
  };

  const handleBack = () => {
    handleClose();
    dispatch(setGameSelectionModalVisible(true));
  };

  const handleExport = () => {
    handleClose();
    dispatch(setExportModalVisible(true));
  };

  const handleOverwrite = () => {
    handleClose();
    dispatch(setSelectedGame(-1));
    dispatch(overwriteGames(backup));
  };

  return (
    <Modal show>
      <ModalHeader>
        <ModalTitle>{t('import_modal.title')}</ModalTitle>
        {!downloading && <CloseButton onClick={handleClose} />}
      </ModalHeader>
      <ModalBody className="justify-content-center">
        {!backup && !downloading && (
          <>
            <p>{t('import_modal.instruction.scan')}</p>
            <QrReader
              constraints={{
                aspectRatio: 1,
                frameRate: 10,
                facingMode: 'environment',
              }}
              onResult={handleQRData}
            />
          </>
        )}
        {downloading && (
          <>
            <AlertIcon>
              <InfoCircleFill />
              {t('import_modal.download_cancel_info')}
            </AlertIcon>
            <span>
              {t('import_modal.downloading', {
                chunks: downloaded + 1,
                total: toDownload,
              })}
            </span>
            {toDownload === -1 ? (
              <div className="d-flex justify-content-center">
                <Spinner animation="grow"></Spinner>
              </div>
            ) : (
              <ProgressBar>
                <div
                  className="progress-bar"
                  style={{ width: `${(downloaded / toDownload) * 100}%` }}
                ></div>
              </ProgressBar>
            )}
          </>
        )}
        {backup && (
          <>
            <AlertIcon variant="warning">
              <ExclamationTriangleFill />
              {t('import_modal.save_game_warning')}
            </AlertIcon>
            <Button onClick={handleOverwrite}>
              {t('import_modal.action.overwrite')}
            </Button>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        {downloading ? (
          <p>{t('import_modal.working')}</p>
        ) : (
          <>
            <Button disabled={gamesLength === 0} onClick={handleExport}>
              {t('import_modal.action.export')}
            </Button>
            <Button onClick={handleBack}>
              {t('import_modal.action.back')}
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default withTranslation()(Import);
