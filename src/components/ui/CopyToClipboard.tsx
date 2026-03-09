import { Copy, CopyCheck } from "lucide-react";
import React, { useState, ReactNode } from "react";

interface CopyToClipboardProps {
  children: ReactNode;
  textToCopy: string;
  successMessage?: string;
  className?: string;
  showCopyIcon?: boolean;
  classNameWrapper?: string;
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  children,
  textToCopy,
  successMessage = "✅ Copied to clipbord!",
  className = "",
  classNameWrapper = "",
  showCopyIcon = true,
}) => {
  const [showMessage, setShowMessage] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onClick={handleCopy}
        className={
          " cursor-pointer flex items-center gap-2 break-all " +
          classNameWrapper
        }
      >
        {children}{" "}
        {showCopyIcon &&
          (showMessage ? (
            <CopyCheck className="text-green-500" size={16} />
          ) : (
            <Copy size={16} />
          ))}
      </div>
      {showMessage && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
          {successMessage}
        </div>
      )}
    </div>
  );
};
