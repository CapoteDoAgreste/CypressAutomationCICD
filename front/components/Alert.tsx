import React from "react";
import { Button } from "./Button";

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "error" | "success" | "warning" | "info";
  testId?: string;
}

export const Alert: React.FC<AlertProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = "error",
  testId,
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    error: "bg-red-50 border-red-100",
    success: "bg-green-50 border-green-100",
    warning: "bg-yellow-50 border-yellow-100",
    info: "bg-blue-50 border-blue-100",
  };

  const iconColors = {
    error: "text-red-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  };

  const titleColors = {
    error: "text-red-900",
    success: "text-green-900",
    warning: "text-yellow-900",
    info: "text-blue-900",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      data-test-id={testId}
    >
      <div
        className={`relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 border ${typeStyles[type]}`}
      >
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${iconColors[type]}`}>
            {type === "error" && (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {type === "success" && (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-lg font-medium ${titleColors[type]}`}>
              {title}
            </h3>
            <div
              className={`mt-2 text-sm ${type === "error" ? "text-red-700" : type === "success" ? "text-green-700" : type === "warning" ? "text-yellow-700" : "text-blue-700"}`}
            >
              {message}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} testId="btn-alert-close">
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};
