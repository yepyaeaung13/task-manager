import { useState } from "react";
import { logout, userInfo } from "../utils/utils";
import LogoutModal from "./LogoutModal";

interface TaskList {
  id: string;
  title: string;
}

export default function SideNav({
  selectedListId,
  handleSelectedListId,
  taskLists,
}: {
  selectedListId: string;
  handleSelectedListId: (id: string) => void;
  taskLists: { items: TaskList[] } | undefined;
  }) {
  const user = userInfo();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  console.log("user", selectedListId);

  return (
    <div className="col-span-4 bg-white flex flex-col h-full rounded-xl p-5">
      <div className="flex items-center space-x-4 mb-5 border-b pb-4">
        {user?.picture && (
          <img
            src={user.picture}
            alt={`${user.name}'s profile`}
            className="w-10 h-10 rounded-full shadow-md object-cover"
          />
        )}
        <div>
          <h1 className="">{user?.name}</h1>
          <h1 className="text-xs text-wrap">{user?.email}</h1>
        </div>
      </div>
      <div className="space-y-3 grow overflow-y-auto">
        <h1>Task Lists</h1>
        <ul className="space-y-2.5">
          {taskLists?.items?.map((list: TaskList) => (
            <li
              key={list.id}
              onClick={() => {
                handleSelectedListId(list.id as string);
              }}
              className={`px-4 py-1 text-sm rounded-2xl shadow-xs border cursor-pointer  ${
                selectedListId === list.id
                  ? "bg-blue-500 text-white"
                  : "bg-secondary border-border-color hover:border-gray-500"
              }`}
            >
              {list.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="text-center">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-2/3 text-sm text-red-500 border border-red-500 rounded-2xl py-1  "
        >
          logout
        </button>
      </div>

      {showLogoutConfirm && (
        <LogoutModal
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={logout}
        />
      )}
    </div>
  );
}
