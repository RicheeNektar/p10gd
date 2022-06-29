import React from 'react';
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
import { Buffer } from 'buffer';
import { setExportModalVisible } from './Export.slice';
import { setGameSelectionModalVisible } from '../game-list/GameList.slice';
import { useState } from 'react';
import { setImportModalVisible } from '../import-games/Import.slice';
import QRCode from 'react-qr-code';
import { gzipSync } from 'react-zlib-js';
import { useEffect } from 'react';
import $ from 'ajax';

const Export = ({ t }) => {
  const dispatch = useDispatch();
  const show = useSelector(state => state.export.modalVisible);
  const games = useSelector(state => state.gameList.games);

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (loading) {
      const data = gzipSync(
        Buffer.from(JSON.stringify(games), 'utf-8')
      ).toString('base64');
      $.post('/api/backup', { data }, (res, content) => {
        setLoading(false);
        setContent(res);
      });
    }
  }, []);

  const handleClose = () => dispatch(setExportModalVisible(false));

  const handleBack = () => {
    handleClose();
    dispatch(setGameSelectionModalVisible(true));
  };

  const handleImport = () => {
    handleClose();
    dispatch(setImportModalVisible(true));
  };

  return (
    <Modal show={show}>
      <ModalHeader>
        <ModalTitle>{t('export_modal.title')}</ModalTitle>
        <CloseButton onClick={handleClose} />
      </ModalHeader>
      <ModalBody>
        {
          loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="grow"></Spinner>
            </div>
          ) : (
            content
          )
          // (
          //   <QRCode
          //     className="position-relative start-50 translate-middle-x"
          //     width="100%"
          //     height="100%"
          //     value="some-link"
          //   />
          // )
        }
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleImport}>{t('export_modal.import')}</Button>
        <Button onClick={handleBack}>{t('export_modal.back')}</Button>
      </ModalFooter>
    </Modal>
  );
};

export default withTranslation()(Export);
