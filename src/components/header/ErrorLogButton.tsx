import { TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorLogger, IErrorLogs } from "../../unities/ErrorLog/ErrorLogger";
import { CopyToClipboard } from "../ui/CopyToClipboard";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { formatDate } from "../../lib/utils";

export function ErrorLogButton() {
  const [isOpen, setIsOpen] = useState(false);
  function handleClick() {
    setIsOpen(!isOpen);
  }

  const [logs, setLogs] = useState<IErrorLogs[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setLogs(ErrorLogger.getLogs().reverse());
  }, [isOpen]);

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <TriangleAlert size={20} />
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Error Log
          </h5>
          {!!logs.length && (
            <CopyToClipboard
              className="text-xs"
              textToCopy={JSON.stringify(logs)}
            >
              Copy All
            </CopyToClipboard>
          )}
        </div>
        <ul className="flex overflow-y-scroll pt-5 flex-col h-auto custom-scrollbar">
          {!logs.length && (
            <li className="text-center text-gray-400">No logs</li>
          )}
          {logs.map((log, index) => (
            <li key={index}>
              <DropdownItem
                tag="div"
                // onItemClick={closeDropdown}
                className="  w-full rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
              >
                <CopyToClipboard
                  className="w-full block"
                  classNameWrapper="w-full"
                  textToCopy={JSON.stringify(log)}
                >
                  <div className="w-full">
                    <div className="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400 space-x-1">
                      <p className="font-medium text-gray-800 dark:text-white/90">
                        {log.context}
                      </p>
                      <p className="font-medium text-gray-800 dark:text-white/90">
                        {log.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>
                        {log.timestamp ? formatDate(log.timestamp) : ""}
                      </span>
                    </div>
                  </div>
                </CopyToClipboard>
                <div className="max-w-md overflow-hidden">
                  {log.stack && (
                    <details className="p-0">
                      <summary className="text-xs">Stack Trace</summary>
                      <pre className="p-0 " style={{ fontSize: "8px" }}>
                        {log.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </DropdownItem>
            </li>
          ))}
        </ul>
      </Dropdown>
    </div>
  );
}
