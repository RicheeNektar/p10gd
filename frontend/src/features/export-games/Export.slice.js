import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { post, ajax } from 'jquery';
import { AES, enc, format } from 'crypto-js';

const bytesPerRequest = 2048;

const flexibleState = {
  status: {
    uploaded: -1,
    toUpload: -1,
  },
  backup: {
    id: undefined,
    key: undefined,
    guid: undefined,
  },
  error: false,
};

const initialState = {
  ...flexibleState,
  isUploading: false,
  modalVisible: false,
};

export const deleteBackup = createAsyncThunk(
  'export/delete-backup',
  async (_, api) => {
    const b = api.getState().export.backup;
    if (b) {
      return ajax('/api/backup', {
        method: 'DELETE',
        data: b,
      }).promise();
    }
    return true;
  }
);

export const prepareBackup = createAsyncThunk(
  'export/backup',
  async (a, api) => {
    const {
      gameList: { games, guid },
    } = api.getState();

    const { id, key } = await post('/api/backup');
    api.dispatch(setBackup({ id, key, guid }));

    const encKey = `${guid}${id}${key}`;
    const data = AES.encrypt(JSON.stringify(games), encKey).toString();
    console.debug(typeof data, data.length);

    const pages = data.length / bytesPerRequest;
    api.dispatch(updateStatus({ toUpload: pages }));

    for (let i = 0; i < pages; i++) {
      console.debug(i * bytesPerRequest, (i + 1) * bytesPerRequest);
      await post('/api/chunk', {
        id,
        chunk_number: Math.floor(i),
        data: data.substring(i * bytesPerRequest, (i + 1) * bytesPerRequest),
      });
      api.dispatch(updateStatus({ uploaded: i }));
    }

    console.debug(id, key, guid);
    return api.fulfillWithValue();
  }
);

const slice = createSlice({
  name: 'Export',
  initialState,
  reducers: {
    setExportModalVisible: (state, { payload: visible }) => {
      state.modalVisible = visible;
    },
    updateStatus: (state, { payload }) => {
      state.status = {
        ...state.status,
        ...payload,
      };
    },
    setBackup: (state, { payload }) => {
      state.backup = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(prepareBackup.pending, state => {
      state.isUploading = true;
      Object.keys(flexibleState).forEach(
        key => (state[key] = flexibleState[key])
      );
    });

    builder.addCase(prepareBackup.fulfilled, state => {
      state.isUploading = false;
    });

    builder.addCase(prepareBackup.rejected, state => {
      state.isUploading = false;
      state.error = true;
    });
  },
});

export const { setExportModalVisible, updateStatus, setBackup } = slice.actions;

export default slice.reducer;
