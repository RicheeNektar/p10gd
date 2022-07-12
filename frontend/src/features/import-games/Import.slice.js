import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AES, enc, format } from 'crypto-js';
import { get } from 'jquery';

const flexibleState = {
  status: {
    toDownload: -1,
    downloaded: -1,
  },
  error: false,
  backup: null,
};

const initialState = {
  ...flexibleState,
  modalVisible: false,
  isDownloading: false,
};

export const downloadChunks = createAsyncThunk(
  'import/download',
  async ({ id, key, guid }, api) => {
    console.debug(id, key, guid);

    try {
      const { chunks } = await get('/api/backup', {
        id,
        key,
      });

      console.debug('chunks:', chunks);
      api.dispatch(setStatus({ toDownload: chunks, downloaded: -1 }));

      const dataDownload = [];
      for (let i = 0; i < chunks; i++) {
        dataDownload.push(await get('/api/chunk', {
          id,
          key,
          chunk_number: i,
        }));
        api.dispatch(setStatus({ downloaded: i }));
        console.debug('Downloaded chunk', i);
      }

      const data = dataDownload.join('');
      console.debug(typeof data, data.length);

      const decKey = `${guid}${id}${key}`;
      const decrypted = AES.decrypt(data, decKey).toString(enc.Utf8);

      const games = JSON.parse(decrypted);
      return api.fulfillWithValue(games);
    } catch (e) {
      console.debug(e);
      return api.rejectWithValue(e);
    }
  }
);

const slice = createSlice({
  name: 'Import',
  initialState,
  reducers: {
    setImportModalVisible: (state, { payload: visible }) => {
      state.modalVisible = visible;
    },
    setBackup: (state, { payload }) => {
      state.backup = payload;
    },
    setStatus: (state, { payload }) => {
      state.status = {
        ...state.status,
        ...payload,
      };
    },
    reset: state => {
      state.isDownloading = false;
      Object.keys(flexibleState).forEach(key => state[key] = flexibleState[key]);
    }
  },
  extraReducers: reducers => {
    reducers.addCase(downloadChunks.pending, state => {
      state.isDownloading = true;
    });

    reducers.addCase(downloadChunks.fulfilled, (state, { payload }) => {
      state.isDownloading = false;
      state.backup = payload;
    });

    reducers.addCase(downloadChunks.rejected, (state, { payload }) => {
      state.isDownloading = false;
      state.error = payload;
    });
  },
});

export const { setImportModalVisible, setBackup, setStatus, reset } = slice.actions;

export default slice.reducer;
