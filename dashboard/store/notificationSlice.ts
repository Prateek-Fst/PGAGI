import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: number;
  message: string;
  time: string;
}

const initialState: Notification[] = [
  { id: 1, message: 'New weather update available', time: '5 mins ago' },
  { id: 2, message: 'GitHub widget updated', time: '1 hour ago' },
];

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.push(action.payload);
    },
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;