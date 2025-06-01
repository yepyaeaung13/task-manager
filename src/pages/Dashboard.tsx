import { useEffect, useState } from "react";
import { useGetTaskLists } from "../query/useGetTaskLists";
import Loading from "../components/Loading";
import TaskList from "../components/TaskList";
import HorizontalWeekPicker from "../components/HorizontalWeekPicker";
import SideNav from "../components/SideNav";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { setSelectedListId } from "../features/taskFilterSlice";
import MobileDrawer from "../components/MobileDrawer";
import IconMenu from "../components/icons/IconMenu";

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const { selectedListId } = useSelector(
    (state: RootState) => state.taskFilter
  );

  const { data: taskLists, isLoading } = useGetTaskLists();

  useEffect(() => {
    if (taskLists?.items?.length) {
      dispatch(setSelectedListId(taskLists.items[0].id));
    }
  }, [taskLists, dispatch]);

  if (isLoading) return <Loading />;

  return (
    <div className="h-[100dvh] flex justify-center items-center">
      <div className="md:bg-secondary bg-white h-full w-full max-w-4xl grid grid-cols-12 gap-2 mx-auto p-2 rounded-xl overflow-hidden">
        {/* Desktop Sidenav */}
        <div className="hidden md:block col-span-4">
          <SideNav
            selectedListId={selectedListId}
            setSelectedListId={setSelectedListId}
            taskLists={taskLists}
          />
        </div>

        {/* Mobile Drawer */}
        <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <SideNav
            selectedListId={selectedListId}
            setSelectedListId={(id) => {
              setSelectedListId(id);
              setDrawerOpen(false); // close drawer on selection
            }}
            taskLists={taskLists}
          />
        </MobileDrawer>

        <div className="md:col-span-8 col-span-12 flex flex-col items-start overflow-hidden max-sm:bg-white">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 bg-white"
            onClick={() => setDrawerOpen(true)}
          >
            <IconMenu />
          </button>
          <HorizontalWeekPicker />
          <div className="flex-1 overflow-hidden w-full max-sm:bg-gray-100">
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
}
