import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SheetState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; id: string };

type UiState = {
  selectedDate: string;
  sheet: SheetState;
};

function todayKey(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

const initialState: UiState = {
  selectedDate: todayKey(),
  sheet: { mode: "closed" },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },
    openCreate(state) {
      state.sheet = { mode: "create" };
    },
    openEdit(state, action: PayloadAction<string>) {
      state.sheet = { mode: "edit", id: action.payload };
    },
    closeSheet(state) {
      state.sheet = { mode: "closed" };
    },
  },
});

export const { setSelectedDate, openCreate, openEdit, closeSheet } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
