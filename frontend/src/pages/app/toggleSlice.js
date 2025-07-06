import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSwitchOn: localStorage.getItem('isSwitchOn') === 'true' ? true : false, 
};

const toggleSlice = createSlice({
  name: 'toggle',
  initialState,
  reducers: {
    toggleSwitch: (state) => {
      state.isSwitchOn = !state.isSwitchOn;
      localStorage.setItem('isSwitchOn', state.isSwitchOn); 
    },
  },
});

export const { toggleSwitch } = toggleSlice.actions;
export default toggleSlice.reducer;
