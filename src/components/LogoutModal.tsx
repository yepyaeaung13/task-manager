// components/LogoutModal.tsx
import { createPortal } from "react-dom";

export default function LogoutModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return createPortal(
    <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl space-y-4 w-72 text-center mx-4">
        <h2 className="text-lg font-semibold">Confirm Logout</h2>
        <p>Are you sure you want to logout?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-1 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-1 text-sm bg-gray-200 rounded-xl hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")!
  );
}
