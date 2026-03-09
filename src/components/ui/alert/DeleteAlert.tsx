import { CircleAlert } from "lucide-react";
import { Modal } from "../modal";
import { useEffect } from "react";

type DeleteAlertType = {
  isOpen: boolean;
  message?: string;
  onDelete: () => void;
  onClose: () => void;
  title?: string;
  closeButtonText?: string;
  okButtonText?: string;
};
export const DeleteAlert = ({
  isOpen,
  message,
  onDelete,
  onClose,
  title = "Are you sure?",
  closeButtonText = "Close",
  okButtonText = "Save Changes",
}: DeleteAlertType) => {
  // call on Delete when peres enter
  useEffect(() => {
    /**
     * on
     */
    const onEnter = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Enter") {
        onDelete();
      }
    };
    window.addEventListener("keydown", onEnter);
    return () => {
      window.removeEventListener("keydown", onEnter);
    };
  }, [isOpen, onDelete]);
  return (
    <Modal
      isOpen={isOpen}
      isFullscreen={false}
      onClose={() => {
        onClose();
      }}
    >
      <div className="text-center">
        <div className="inline-block bg-red-50 rounded-full p-3">
          <CircleAlert
            className="mx-auto text-red-400"
            strokeWidth={1.4}
            size={50}
          />
        </div>
        <h3 className="text-2xl">{title}</h3>
        <p>{message || "Do you want to delete?"}</p>
        <div>
          <div className="flex items-center justify-center w-full gap-3 mt-8">
            <button
              onClick={() => {
                onClose();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 "
            >
              {closeButtonText}
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-red-400 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 "
            >
              {okButtonText}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
