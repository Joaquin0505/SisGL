import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateTypes{
    isSidebarCoolapsed:boolean;
    isDarkMode:boolean;
}

const initialState:InitialStateTypes={
    isSidebarCoolapsed:false,
    isDarkMode:false
};

export const globalSlice = createSlice({
    name:"global",
    initialState,
    reducers:{
        setIsSidebarCollapsed:(state,action:PayloadAction<boolean>)=>{
            state.isSidebarCoolapsed=action.payload;
        },
        setIsDarkMode:(state, action:PayloadAction<boolean>)=>{
            state.isDarkMode=action.payload;
        },
    },
});

export const{setIsDarkMode, setIsSidebarCollapsed} = globalSlice.actions;
export default globalSlice.reducer;