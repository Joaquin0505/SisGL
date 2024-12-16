// src/state/empresaSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmpresaState {
  name: string;
  imagen: string | undefined;
}

const initialState: EmpresaState = {
  name: '',
  imagen: undefined,
};

const empresaSlice = createSlice({
  name: 'empresa',
  initialState,
  reducers: {
    setEmpresa: (state, action: PayloadAction<EmpresaState>) => {
      state.name = action.payload.name;
      state.imagen = action.payload.imagen;
    },
  },
});

export const { setEmpresa } = empresaSlice.actions;
export default empresaSlice.reducer;
