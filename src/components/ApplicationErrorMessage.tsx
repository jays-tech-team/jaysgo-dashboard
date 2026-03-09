import { Construction } from "lucide-react";
import React from "react";

interface ApplicationErrorMessageProps {
  message?: string;
}

const DEFAULT_ERROR_MESSAGE =
  "An unexpected error occurred. Please consider to refresh the page. if you are facing the issue more often. Please contact technical support.";

const ApplicationErrorMessage: React.FC<ApplicationErrorMessageProps> = ({
  message,
}) => (
  <div
    className="text-red-700 bg-red-50 border border-red-200 p-4 rounded-md my-4 text-base"
    role="alert"
    data-testid="application-error-message"
  >
    <Construction size={32} />
    {message || DEFAULT_ERROR_MESSAGE}
  </div>
);

export default ApplicationErrorMessage;
