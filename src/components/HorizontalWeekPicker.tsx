import { useEffect, useState } from "react";
import {
  addDays,
  subDays,
  startOfWeek,
  format,
  isToday,
  isSameDay,
} from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { setWeekRange, setSelectedDate } from "../features/taskFilterSlice";
import IconLeft from "./icons/IconLeft";
import IconRight from "./icons/IconRight";
import type { RootState } from "../store";

export default function HorizontalWeekPicker() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const dispatch = useDispatch();
  const { selectedDate } = useSelector((state: RootState) => state.taskFilter);

  const getWeekDays = (start: Date) =>
    Array.from({ length: 7 }).map((_, i) => addDays(start, i));

  const days = getWeekDays(currentWeekStart);

  const goToPrevWeek = () => setCurrentWeekStart((prev) => subDays(prev, 7));
  const goToNextWeek = () => setCurrentWeekStart((prev) => addDays(prev, 7));

  useEffect(() => {
    dispatch(
      setWeekRange({
        dueMin: new Date(currentWeekStart).toISOString(),
        dueMax: addDays(currentWeekStart, 7).toISOString(),
      })
    );
  }, [currentWeekStart, dispatch]);

  const handleDateSelect = (date: Date) => {
    if (isSameDay(date, selectedDate)) {
      dispatch(setSelectedDate(""));
    } else {
      dispatch(setSelectedDate(date.toISOString() as string));
    }
  };

  return (
    <div className="md:p-4 p-2 w-full max-w-2xl mx-auto bg-white rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevWeek}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200  "
        >
          <IconLeft />
        </button>
        <h2 className="font-semibold text-lg">
          {format(currentWeekStart, "MMM d")} -{" "}
          {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
        </h2>
        <button
          onClick={goToNextWeek}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200  "
        >
          <IconRight />
        </button>
      </div>

      <div className="flex space-x-2 overflow-x-auto">
        {days.map((day) => (
          <button
            key={day.toDateString()}
            onClick={() => handleDateSelect(day)}
            className={`flex flex-col items-center md:px-3 px-2 py-2 rounded-lg  md:min-w-[70px] min-w-[30px] cursor-pointer`}
          >
            <span className="md:text-sm text-xs font-medium">{format(day, "EEE")}</span>
            <span
              className={`mt-1 text-lg font-bold md:w-9 md:h-9 w-8 h-8 flex justify-center items-center rounded-full
              ${
                isSameDay(day, selectedDate)
                  ? "bg-yellow-100 text-black border-yellow-300"
                  : isToday(day)
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              }`}
            >
              {format(day, "d")}
            </span>
            {/* {isToday(day) && <span className="text-xs">Today</span>} */}
          </button>
        ))}
      </div>
    </div>
  );
}
// Removed unused function zonedTimeToUtc

