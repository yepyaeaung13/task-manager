import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import { startOfWeek, addDays } from "date-fns";

interface TaskFilterState {
  dueMin: string;
  dueMax: string;
  selectedDate: string;
  selectedListId: string;
}

const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });

const initialState: TaskFilterState = {
  dueMin: weekStart.toISOString(),
  dueMax: addDays(weekStart, 6).toISOString(),
  selectedDate: "",
  selectedListId: "",
};

const taskFilterSlice = createSlice({
  name: "taskFilter",
  initialState,
  reducers: {
    setWeekRange(state: TaskFilterState, action: PayloadAction<{ dueMin: string; dueMax: string }>) {
      state.dueMin = action.payload.dueMin;
      state.dueMax = action.payload.dueMax;
    },
    setSelectedDate(state: TaskFilterState, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },
    setSelectedListId(state: TaskFilterState, action: PayloadAction<string>) {
      state.selectedListId = action.payload;
    },
  },
});

export const { setWeekRange, setSelectedDate, setSelectedListId } = taskFilterSlice.actions;
export default taskFilterSlice.reducer;
