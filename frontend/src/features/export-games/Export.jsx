import React, { useRef } from 'react';
import {
  Button,
  CloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Spinner,
} from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteBackup,
  prepareBackup,
  setExportModalVisible,
} from './Export.slice';
import { setGameSelectionModalVisible } from '../game-list/GameList.slice';
import { setImportModalVisible } from '../import-games/Import.slice';
import { useEffect } from 'react';
import AlertIcon from '../../components/AlertIcon';
import { InfoCircleFill } from 'react-bootstrap-icons';
import QRCode from '../qr/QRCode.tsx';

const Export = ({ t }) => {
  const dispatch = useDispatch();
  const uploading = useSelector(state => state.export.isUploading);
  const isError = useSelector(state => state.export.error);
  const backup = useSelector(state => state.export.backup);

  useEffect(() => {
    dispatch(deleteBackup());
    if (!uploading) {
      dispatch(prepareBackup());
    }
  }, []);

  const handleClose = () => {
    dispatch(deleteBackup());
    dispatch(setExportModalVisible(false));
  };

  const handleBack = () => {
    handleClose();
    dispatch(setGameSelectionModalVisible(true));
  };

  const handleImport = () => {
    handleClose();
    dispatch(setImportModalVisible(true));
  };

  return (
    <Modal show>
      <ModalHeader>
        <ModalTitle>{t('export_modal.title')}</ModalTitle>
        <CloseButton onClick={handleClose} />
      </ModalHeader>
      <ModalBody>
        <AlertIcon>
          <InfoCircleFill />
          {t('export_modal.close_notice')}
        </AlertIcon>
        <div className="d-flex justify-content-center">
          {uploading ? (
            <Spinner animation="border"></Spinner>
          ) : isError ? (
            <p>An error occurred.</p>
          ) : (
            backup && <QRCode value={JSON.stringify(backup)} />
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleImport}>
          {t('export_modal.action.import')}
        </Button>
        <Button onClick={handleBack}>{t('export_modal.action.back')}</Button>
      </ModalFooter>
    </Modal>
  );
};

export default withTranslation()(Export);
