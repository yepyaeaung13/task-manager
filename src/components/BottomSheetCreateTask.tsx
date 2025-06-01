import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconTrash from "./icons/IconTrash";

type Props = {
  dialogTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: () => void;
  onDeleteTask?: () => void;
  editTitle?: string;
  setEditTitle: (title: string) => void;
  editNotes?: string;
  setEditNotes: (notes: string) => void;
  editDate?: string;
  setEditDate: (date: string) => void;
  editCheck?: boolean;
  setEditCheck: (check: boolean) => void;
  isDisabledCreateBtn?: boolean;
};

export default function BottomSheetCreateTask({
  dialogTitle,
  isOpen,
  onClose,
  onCreateTask,
  onDeleteTask,
  editTitle,
  setEditTitle,
  editNotes,
  setEditNotes,
  editDate,
  setEditDate,
  editCheck,
  setEditCheck,
  isDisabledCreateBtn,
}: Props) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        onClose={onClose}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transition ease-out duration-300 transform"
          enterFrom="translate-y-full sm:translate-y-0 sm:scale-95"
          enterTo="translate-y-0 sm:scale-100"
          leave="transition ease-in duration-200 transform"
          leaveFrom="translate-y-0 sm:scale-100"
          leaveTo="translate-y-full sm:translate-y-0 sm:scale-95"
        >
          <Dialog.Panel className="w-full sm:max-w-md h-[90dvh] bg-white z-50 rounded-t-2xl sm:rounded-xl p-6">
            <div className="relative flex items-center justify-center mb-4">
              <button
                onClick={onClose}
                className="absolute left-0 text-gray-500 hover:text-gray-700"
              >
                close
              </button>
              <Dialog.Title className="text-lg font-semibold">
                {dialogTitle}
              </Dialog.Title>
            </div>
            <div className="space-y-4 relative">
              <div>
                <label className="block font-medium">Title</label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                  className="border-b border-gray-500 focus:border-blue-500 focus:outline-none w-full transition-all duration-200"
                />
              </div>
              <div>
                <label className="block font-medium">Notes</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full mt-1 text-sm border border-gray-500 focus:border-blue-500 focus:outline-none p-1 rounded-md transition-all duration-200"
                  rows={7}
                />
              </div>
              <div>
                <label className="block font-medium">Date</label>
                <input
                  type="date"
                  value={editDate || ""}
                  onChange={(e) => setEditDate(e.target.value)}
                  className=" text-sm border border-gray-500 focus:border-blue-500 focus:outline-none p-1 rounded-md transition-all duration-200 appearance-none"
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="block font-medium">Status</label>
                <input
                  type="checkbox"
                  checked={editCheck}
                  onChange={() => setEditCheck(!editCheck)}
                  className="cursor-pointer -mt-1.5"
                />
              </div>
              <div className="mt-10  flex gap-3">
                {dialogTitle === "Update Task" && (
                  <button
                    className="px-3 bg-red-200 rounded-xl text-red-500 hover:text-red-700"
                    onClick={() => {
                      onDeleteTask?.();
                      onClose();
                    }}
                  >
                    <IconTrash />
                  </button>
                )}
                <button
                  onClick={() => {
                    onCreateTask();
                    onClose();
                  }}
                  disabled={isDisabledCreateBtn}
                  className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl ${
                    isDisabledCreateBtn ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {dialogTitle === "Create Task" ? "Add task" : "Update task"}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
