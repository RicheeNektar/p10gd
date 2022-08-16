import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  CloseButton,
  FormSelect,
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
import {
  downloadChunks,
  setImportModalVisible,
  reset,
  updateMediaDevices,
  setSelectedDevice,
} from './Import.slice';
import { ExclamationTriangleFill, InfoCircleFill } from 'react-bootstrap-icons';
import AlertIcon from '../../components/AlertIcon';
import { setSelectedGame } from '../game-stats/GameStats.slice';
import { overwriteGames } from '../game-list/GameList.slice';
import QRReader from '../qr/QRReader.tsx';

const Import = ({ t }) => {
  const dispatch = useDispatch();
  const gamesLength = useSelector(state => state.gameList.games?.length);
  const downloading = useSelector(state => state.import.isDownloading);
  const backup = useSelector(state => state.import.backup);
  const { toDownload, downloaded } = useSelector(state => state.import.status);
  const error = useSelector(state => state.import.error);
  const devices = useSelector(state => state.import.devices);
  const selectedDevice = useSelector(state => state.import.selectedDevice);

  useEffect(() => {
    if (!downloading) {
      dispatch(reset());
    }
    dispatch(updateMediaDevices());
  }, []);

  const handleQRData = data => {
    if (!data) {
      return;
    }

    try {
      dispatch(downloadChunks(JSON.parse(data)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleReaderError = e => {};

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
        {error ? (
          <>
            <AlertIcon>
              <InfoCircleFill />
              {t(`import_modal.error.${error}`)}
            </AlertIcon>
            <Button
              onClick={() => {
                dispatch(updateMediaDevices());
                dispatch(reset());
              }}
            >
              {t('import_modal.action.retry')}
            </Button>
          </>
        ) : (
          devices &&
          selectedDevice &&
          !backup &&
          !downloading && (
            <>
              <FormSelect
                value={selectedDevice.label}
                onChange={e =>
                  dispatch(
                    setSelectedDevice(
                      devices.find(
                        device => e.target.selectedOptions[0].id === device.id
                      )
                    )
                  )
                }
              >
                {devices.map(device => (
                  <option id={device.id} key={device.id}>
                    {device.label}
                  </option>
                ))}
              </FormSelect>
              <p>{t('import_modal.instruction.scan')}</p>
              <QRReader
                onData={handleQRData}
                onError={handleReaderError}
                deviceId={selectedDevice.id}
              />
            </>
          )
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
            <Button variant="warning" onClick={handleOverwrite}>
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
            <Button variant="secondary" onClick={handleBack}>
              {t('import_modal.action.back')}
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default withTranslation()(Import);
