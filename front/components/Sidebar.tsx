import React from "react";
import { ViewState, PermissionCode, User } from "../types";
import { checkPermission } from "../services/mockDb";

interface SidebarProps {
  currentUser: User;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  currentView,
  onChangeView,
  onLogout,
}) => {
  const navItem = (
    view: ViewState,
    label: string,
    icon: React.ReactNode,
    perm?: PermissionCode,
  ) => {
    if (perm && !checkPermission(currentUser, perm)) return null;

    const isActive = currentView === view;
    return (
      <button
        data-test-id={`nav-${view.toLowerCase()}`}
        onClick={() => onChangeView(view)}
        className={`w-full flex items-center space-x-3 px-4 py-3 mb-1 rounded-lg transition-colors ${
          isActive
            ? "bg-indigo-50 text-indigo-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-xl font-bold text-gray-900">StockGuard</span>
        </div>
        <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-500">
          User:{" "}
          <span
            className="font-semibold text-gray-700"
            data-test-id="current-user"
          >
            {currentUser.username}
          </span>
          <br />
          Role:{" "}
          <span data-test-id="current-user-role">
            {currentUser.isAdmin ? "Admin" : "User"}
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {navItem(
          "DASHBOARD",
          "Dashboard",
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>,
        )}

        {navItem(
          "STOCK",
          "Inventory",
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>,
          PermissionCode.VIEW_STOCK,
        )}

        {navItem(
          "USERS",
          "Users",
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>,
          PermissionCode.VIEW_USERS,
        )}

        {navItem(
          "GROUPS",
          "Groups & Perms",
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>,
          PermissionCode.VIEW_GROUPS,
        )}

        {navItem(
          "BACKEND_EXPORT",
          "Get Source Code",
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>,
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          data-test-id="btn-logout"
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
