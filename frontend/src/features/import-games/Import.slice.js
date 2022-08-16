import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AES, enc } from 'crypto-js';
import { get } from 'jquery';

const flexibleState = {
  status: {
    toDownload: -1,
    downloaded: -1,
  },
  error: null,
  backup: null,
};

const initialState = {
  ...flexibleState,
  modalVisible: false,
  isDownloading: false,
  devices: null,
  selectedDevice: null,
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

      if (!chunks) {
        throw new Error('invalid_server_response');
      }

      console.debug('chunks:', chunks);
      api.dispatch(setStatus({ toDownload: chunks, downloaded: -1 }));

      const dataDownload = [];
      for (let i = 0; i < chunks; i++) {
        const chunk = await get('/api/chunk', {
          id,
          key,
          chunk_number: i,
        });

        dataDownload.push(chunk);
        api.dispatch(setStatus({ downloaded: i }));
        console.debug('Downloaded chunk', i);
      }

      const data = dataDownload.join('');
      console.debug(typeof data, data.length);

      const decrypted = AES.decrypt(data, `${guid}${id}${key}`).toString(
        enc.Utf8
      );
      return api.fulfillWithValue(JSON.parse(decrypted));
    } catch (e) {
      console.debug(e);
      return api.rejectWithValue(
        e?.responseJSON?.error ?? e?.message ?? 'unknown'
      );
    }
  },
  {
    condition: (_arg, api) => {
      const state = api.getState().import;
      return !state.error && !state.isDownloading;
    },
  }
);

export const updateMediaDevices = createAsyncThunk(
  'input/update-media-devices',
  async (_, api) => {
    const devices = (await navigator.mediaDevices.enumerateDevices())
      .filter(device => device.kind === 'videoinput')
      .map(device => ({ id: device.deviceId, label: device.label }));

    if (devices[0].label === '') {
      return api.rejectWithValue('no_cam_permission');
    }

    return api.fulfillWithValue(devices);
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
    setSelectedDevice: (state, { payload }) => {
      state.selectedDevice = payload;
    },
    reset: state => {
      state.isDownloading = false;
      Object.keys(flexibleState).forEach(
        key => (state[key] = flexibleState[key])
      );
    },
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

    reducers.addCase(updateMediaDevices.fulfilled, (state, { payload }) => {
      state.devices = payload;
      state.selectedDevice = payload[0];
    });

    reducers.addCase(updateMediaDevices.rejected, (state, { payload }) => {
      state.devices = [];
      state.selectedDevice = null;
      state.error = payload;
    });
  },
});

export const {
  setSelectedDevice,
  setImportModalVisible,
  setBackup,
  setStatus,
  reset,
} = slice.actions;

export default slice.reducer;
