import { useState } from "react";
import { useGetTasksFromList } from "../query/useGetTasksFromList";
import {
  useUpdateStatusTask,
  useUpdateTask,
  type UpdateTask,
} from "../query/useUpdateTask";
import type { RootState } from "../store";
import { useSelector } from "react-redux";
import { isSameDay } from "date-fns";
import { getMyanmarTime } from "../utils/utils";
import { useCreateTask } from "../query/useCreateTask";
import { useDeleteTask } from "../query/useDeleteTask";
import BottomSheetCreateTask from "./BottomSheetCreateTask";
import { useMediaQuery } from '@react-hookz/web';


type TaskFilter = "all" | "completed" | "needsAction";

export default function TaskList() {
const isMobile = useMediaQuery("(max-width: 767px)");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editCheck, setEditCheck] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editDate, setEditDate] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<UpdateTask | null>(null);
  const [isCreateBottomSheetOpen, setIsCreateBottomSheetOpen] = useState(false);
  const [isUpdateBottomSheetOpen, setIsUpdateBottomSheetOpen] = useState(false);

  const isDisabledCreateBtn = !(
    editTitle.trim().length > 0 &&
    editNotes.trim().length > 0 &&
    editDate.length > 0
  );

  const { dueMin, dueMax, selectedDate, selectedListId } = useSelector(
    (state: RootState) => state.taskFilter
  );

  const { data: tasks, isLoading } = useGetTasksFromList(selectedListId!, {
    dueMin: getMyanmarTime(dueMin),
    dueMax: getMyanmarTime(dueMax),
    showCompleted: true,
    showHidden: true,
  });

  const handleCancel = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditNotes("");
    setEditDate("");
    setEditCheck(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setSelectedTask(null);
    setEditingTaskId(null);
    setEditTitle("");
    setEditNotes("");
    setEditDate("");
    setEditCheck(false);
  };

  const createTask = useCreateTask(handleCancel);
  const updateTask = useUpdateTask(handleCancel);
  const updateStatusTask = useUpdateStatusTask();
  const { mutate: deleteTaskMutation } = useDeleteTask(handleDeleteCancel);

  const filteredTasks = tasks?.items?.filter((task: UpdateTask) => {
    const statusMatch = filter === "all" || task.status === filter;
    const isSame =
      !selectedDate ||
      (task.due &&
        isSameDay(
          new Date(task.due).toDateString(),
          new Date(selectedDate).toISOString()
        ));

    return isSame && statusMatch;
  });

  const handleToggleComplete = (task: UpdateTask) => {
    updateStatusTask.mutate({
      ...task,
      listId: selectedListId,
      status: task.status === "completed" ? "needsAction" : "completed",
    });
  };

  const handleEditSave = (task: UpdateTask) => {
    updateTask.mutate({
      ...task,
      status: editCheck ? "completed" : "needsAction",
      title: editTitle,
      notes: editNotes,
      due: editDate ? new Date(editDate).toISOString() : task.due,
      listId: selectedListId,
    });
  };

  const handleCreateTask = () => {
    setEditingTaskId("new");
  };

  const handleCreateTaskSave = () => {
    createTask.mutate({
      listId: selectedListId,
      status: editCheck ? "completed" : "needsAction",
      title: editTitle,
      notes: editNotes,
      due: new Date(editDate).toISOString(),
    });
  };

  const handleDelete = () => {
    if (!selectedTask) return;
    deleteTaskMutation({ taskId: selectedTask.id, listId: selectedListId });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden md:p-5 p-2 space-y-4">
      <div className="flex justify-between items-center">
        {/* Filters */}
        <div className="flex gap-2">
          {["all", "completed", "needsAction"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as TaskFilter)}
              className={`px-3 py-1 rounded-xl text-sm border border-border-color shadow-xs ${
                filter === f ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              {f === "all"
                ? "All Tasks"
                : f === "completed"
                ? "Completed"
                : "Pending"}
            </button>
          ))}
        </div>

        {/* Create Task Button */}
        <button
          onClick={handleCreateTask}
          className="hidden md:inline-block px-4 py-1.5 bg-blue-500 text-white rounded-xl text-sm shadow-md"
        >
          + Create Task
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto pr-1.5 space-y-3">
        <ul className="space-y-3 pr-1.5">
          {editingTaskId === "new" && (
            <li className="bg-green-50 border border-border-color rounded-md shadow-md p-4 flex justify-between items-start">
              <div className="space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editCheck}
                    onChange={() => setEditCheck(!editCheck)}
                    className="cursor-pointer"
                  />
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                    className="border-b border-gray-500 focus:border-blue-500 focus:outline-none w-full transition-all duration-200"
                  />
                </div>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full mt-1 text-sm border border-gray-500 focus:border-blue-500 focus:outline-none p-1 rounded-md transition-all duration-200"
                  rows={2}
                />
                <input
                  type="date"
                  value={editDate || ""}
                  onChange={(e) => setEditDate(e.target.value)}
                  className=" text-sm border border-gray-500 focus:border-blue-500 focus:outline-none p-1 rounded-md transition-all duration-200 appearance-none"
                />
              </div>
              <div className="ml-4">
                <div className="space-y-1">
                  <button
                    onClick={handleCreateTaskSave}
                    disabled={isDisabledCreateBtn}
                    className={`w-full text-xs bg-green-500 border border-green-500 text-white px-2 py-1 rounded-xl ${
                      isDisabledCreateBtn
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : ""
                    }`}
                  >
                    Save
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancel();
                    }}
                    className="w-full text-xs border border-gray-400 px-2 py-1 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </li>
          )}

          {filteredTasks
            ?.sort((a: UpdateTask, b: UpdateTask) => {
              return (
                new Date(b.updated!).getTime() - new Date(a.updated!).getTime()
              );
            })
            .map((task: UpdateTask) => (
              <li
                key={task.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isMobile) {
                    setIsUpdateBottomSheetOpen(true);
                  }
                  setSelectedTask(task);
                  setEditingTaskId(task.id);
                  setEditCheck(task.status === "completed" ? true : false);
                  setEditTitle(task.title);
                  setEditNotes(task.notes ?? "");
                  setEditDate(task.due ? task.due.split("T")[0] : "");
                }}
                className="group bg-white border border-border-color rounded-md shadow-md p-4 flex justify-between items-start cursor-pointer"
              >
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    {editingTaskId === task.id && !isMobile ? (
                      <input
                        type="checkbox"
                        checked={editCheck}
                        onChange={() => setEditCheck(!editCheck)}
                        className="cursor-pointer"
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={task.status === "completed"}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => {
                          handleToggleComplete(task);
                        }}
                        className="cursor-pointer"
                      />
                    )}

                    {editingTaskId === task.id && !isMobile ? (
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                        className="border-b border-gray-500 focus:border-blue-500 focus:outline-none w-full transition-all duration-200"
                      />
                    ) : (
                      <p
                        className={`font-medium text-black ${
                          task.status === "completed" ? " text-gray-400" : ""
                        }`}
                      >
                        {task.title}
                      </p>
                    )}
                  </div>

                  {editingTaskId === task.id && !isMobile ? (
                    <textarea
                      value={editNotes}
                      defaultValue={task.notes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full mt-1 text-sm border border-gray-500 focus:border-blue-500 focus:outline-none p-1 rounded-md transition-all duration-200 cursor-pointer"
                      rows={2}
                    />
                  ) : (
                    task.notes && (
                      <p className="text-sm text-gray-500 pl-5">{task.notes}</p>
                    )
                  )}

                  {editingTaskId === task.id && !isMobile ? (
                    <input
                      type="date"
                      value={editDate || ""}
                      onChange={(e) => setEditDate(e.target.value)}
                      className=" text-sm border border-gray-500 focus:border-blue-500 focus:outline-none p-1 rounded-md transition-all duration-200 appearance-none"
                    />
                  ) : (
                    task.due && (
                      <p className="text-xs text-gray-500 pl-5">
                        Due: {new Date(task.due).toLocaleDateString()}
                      </p>
                    )
                  )}
                </div>

                {/* Status Tag or Save Button */}
                <div className="ml-4">
                  {editingTaskId === task.id && !isMobile ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => handleEditSave(task)}
                        className="w-full text-xs bg-green-500 border border-green-500 text-white px-2 py-1 rounded-xl"
                      >
                        Save
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel();
                        }}
                        className="w-full text-xs border border-gray-400 px-2 py-1 rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-right">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {task.status === "completed" ? "Completed" : "Pending"}
                      </span>

                      {/* 🚨 Delete Button */}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(true);
                          setSelectedTask(task);
                        }}
                        className="inline-block text-xs bg-red-50 px-2 py-1 rounded text-red-600 mt-2 hover:underline"
                      >
                        Delete
                      </span>
                    </div>
                  )}
                </div>
              </li>
            ))}

          {/* Loading State */}
          {isLoading && (
            <li className="text-gray-400 text-center mt-10">loading...</li>
          )}

          {/* No Tasks */}
          {filteredTasks?.length === 0 && (
            <li className="text-gray-400 text-center mt-10">No tasks found.</li>
          )}
        </ul>
      </div>

      {/* Create Task Button */}
      <button
        onClick={() => setIsCreateBottomSheetOpen(true)}
        className="md:hidden px-4 py-2 bg-blue-500 text-white rounded-xl text-sm shadow-md"
      >
        + Create Task
      </button>
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/20 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl space-y-4 w-72 text-center">
            <h2 className="text-lg font-semibold">Confirm Delete</h2>
            <p>Are you sure you want to delete task?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="px-4 py-1 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedTask(null);
                }}
                className="px-4 py-1 text-sm bg-gray-200 rounded-xl hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomSheetCreateTask
        dialogTitle="Create Task"
        isOpen={isCreateBottomSheetOpen}
        onClose={() => setIsCreateBottomSheetOpen(false)}
        onCreateTask={handleCreateTaskSave}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editNotes={editNotes}
        setEditNotes={setEditNotes}
        editDate={editDate}
        setEditDate={setEditDate}
        editCheck={editCheck}
        setEditCheck={setEditCheck}
        isDisabledCreateBtn={isDisabledCreateBtn}
      />

      <BottomSheetCreateTask
        dialogTitle="Update Task"
        isOpen={isUpdateBottomSheetOpen}
        onClose={() => setIsUpdateBottomSheetOpen(false)}
        onCreateTask={() => handleEditSave(selectedTask!)}
        onDeleteTask={() =>  handleDelete()}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editNotes={editNotes}
        setEditNotes={setEditNotes}
        editDate={editDate}
        setEditDate={setEditDate}
        editCheck={editCheck}
        setEditCheck={setEditCheck}
        isDisabledCreateBtn={isDisabledCreateBtn}
      />
    </div>
  );
}
