import React from 'react';
import {
  Button,
  CloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  PageItem,
  Pagination,
} from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Buffer } from 'buffer';
import { setExportModalVisible } from './Export.slice';
import { setGameSelectionModalVisible } from '../game-list/GameList.slice';
import { useState } from 'react';
import { setImportModalVisible } from '../import-games/Import.slice';
import QRCode from '../qr-code/QRCode';
import { gzipSync } from 'react-zlib-js';

const hexPerCode = 2048;

const Export = ({ t }) => {
  const dispatch = useDispatch();
  const show = useSelector(state => state.export.modalVisible);
  const games = useSelector(state => state.gameList.games);

  const [page, setPage] = useState(0);

  const gamesHex = gzipSync(Buffer.from(JSON.stringify(games), 'utf-8')).toString(
    'base64'
  );

  const totalPages = Math.ceil(gamesHex.length / hexPerCode) - 1;

  const handlePage = p => setPage(Math.max(Math.min(p, totalPages), 0));

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
      <ModalBody className="justify-content-center">
        <QRCode
          className="position-relative start-50 translate-middle-x"
          value={JSON.stringify({
            page,
            totalPages,
            length: hexPerCode,
            data: gamesHex.slice(page * hexPerCode, (page + 1) * hexPerCode),
          })}
        />
        <Pagination className="m-2 justify-content-center">
          <PageItem onClick={() => handlePage(page - 1)}>«</PageItem>
          <PageItem>
            {page + 1} / {totalPages + 1}
          </PageItem>
          <PageItem onClick={() => handlePage(page + 1)}>»</PageItem>
        </Pagination>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleImport}>{t('export_modal.import')}</Button>
        <Button onClick={handleBack}>{t('export_modal.back')}</Button>
      </ModalFooter>
    </Modal>
  );
};

export default withTranslation()(Export);
