import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { StockView } from './views/StockView';
import { UsersView } from './views/UsersView';
import { GroupsView } from './views/GroupsView';
import { BackendGenerator } from './views/BackendGenerator';
import { User, ViewState, PermissionCode } from './types';
import { db, checkPermission } from './services/mockDb';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');

  // Simple Login Screen for the Mock
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
           <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">S</span>
            </div>
           </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">StockGuard Login</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Select a user role to simulate (Mock Mode)</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-4">
            {db.getUsers().map(user => (
              <button
                key={user.id}
                onClick={() => setCurrentUser(user)}
                className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                data-test-id={`login-${user.username}`}
              >
                <span>{user.username}</span>
                <span className={`text-xs px-2 py-1 rounded ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                  {user.isAdmin ? 'Admin' : 'User'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Routing Logic
  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <DashboardView currentUser={currentUser} />;
      case 'STOCK':
        return checkPermission(currentUser, PermissionCode.VIEW_STOCK) 
          ? <StockView currentUser={currentUser} />
          : <div className="p-8 text-red-500">Access Denied</div>;
      case 'USERS':
        return checkPermission(currentUser, PermissionCode.VIEW_USERS)
          ? <UsersView currentUser={currentUser} />
          : <div className="p-8 text-red-500">Access Denied</div>;
      case 'GROUPS':
        return checkPermission(currentUser, PermissionCode.VIEW_GROUPS)
          ? <GroupsView currentUser={currentUser} />
          : <div className="p-8 text-red-500">Access Denied</div>;
      case 'BACKEND_EXPORT':
        return <BackendGenerator />;
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        currentUser={currentUser} 
        currentView={currentView} 
        onChangeView={setCurrentView}
        onLogout={() => setCurrentUser(null)}
      />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
}

export default App;