import React, { useState, useEffect } from "react";
import { User, UserGroup, PermissionCode } from "../types";
import { checkPermission } from "../services/mockDb";
import { usersApi, groupsApi } from "../services/apiService";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Alert } from "../components/Alert";

interface UsersViewProps {
  currentUser: User;
}

export const UsersView: React.FC<UsersViewProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    isAdmin: false,
    groupId: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const canManage = checkPermission(currentUser, PermissionCode.MANAGE_USERS);

  const showAlert = (title: string, msg: string) => {
    setAlertTitle(title);
    setAlertMsg(msg);
    setAlertOpen(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [usersData, groupsData] = await Promise.all([
      usersApi.getAll(),
      groupsApi.getAll(),
    ]);
    setUsers(usersData);
    setGroups(groupsData);
    setIsLoading(false);
  };

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      setIsLoading(true);
      const success = await usersApi.delete(userToDelete);
      if (success) {
        await loadData();
        setDeleteConfirmOpen(false);
        setUserToDelete(null);
      } else {
        showAlert("Erro", "Erro ao deletar usuário");
      }
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newUser.username.trim()) {
      showAlert("Validação", "Username é obrigatório");
      return;
    }

    setIsLoading(true);
    const success = await usersApi.create({
      username: newUser.username,
      isAdmin: newUser.isAdmin,
      groupId: newUser.groupId || undefined,
    });

    if (success) {
      await loadData();
      setIsModalOpen(false);
      setNewUser({ username: "", isAdmin: false, groupId: "" });
    } else {
      showAlert("Erro", "Erro ao criar usuário");
    }
    setIsLoading(false);
  };

  const handleGroupChange = (userId: string, groupId: string) => {
    const updated = users.map((u) => (u.id === userId ? { ...u, groupId } : u));
    setUsers(updated);
    // TODO: Implementar endpoint para atualizar grupo de usuário
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl font-bold text-gray-900"
          data-test-id="page-title-users"
        >
          User Management
        </h1>
        {canManage && (
          <Button onClick={() => setIsModalOpen(true)} testId="btn-add-user">
            Add User
          </Button>
        )}
      </div>

      <div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        data-test-id="users-grid"
      >
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            data-test-id={`user-card-${user.username}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3
                    className="font-semibold text-gray-900"
                    data-test-id={`user-name`}
                  >
                    {user.username}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${user.isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                    data-test-id={`user-role`}
                    role={user.isAdmin ? "admin" : "standard"}
                  >
                    {user.isAdmin ? "Super Admin" : "Standard User"}
                  </span>
                </div>
              </div>
              {canManage && !user.isAdmin && (
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-gray-400 hover:text-red-500"
                  data-test-id="remove-user-button"
                >
                  <svg
                    className="w-5 h-5"
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
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Assigned Group
                </label>
                {canManage && !user.isAdmin ? (
                  <select
                    className="mt-1 block w-full text-sm border-gray-300 rounded-md border p-1"
                    value={user.groupId || ""}
                    onChange={(e) => handleGroupChange(user.id, e.target.value)}
                    data-test-id={`select-group`}
                  >
                    <option value="">No Group</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm mt-1 text-gray-700 font-medium">
                    {groups.find((g) => g.id === user.groupId)?.name ||
                      (user.isAdmin ? "N/A (Admin)" : "No Group")}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create User"
        testId="modal-create-user"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-1"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              data-test-id="input-username"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAdmin"
              checked={newUser.isAdmin}
              onChange={(e) =>
                setNewUser({ ...newUser, isAdmin: e.target.checked })
              }
              data-test-id="check-is-admin"
            />
            <label htmlFor="isAdmin" className="text-sm text-gray-700">
              Is Super Admin
            </label>
          </div>
          {!newUser.isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Initial Group
              </label>
              <select
                className="w-full border p-2 rounded mt-1"
                value={newUser.groupId}
                onChange={(e) =>
                  setNewUser({ ...newUser, groupId: e.target.value })
                }
                data-test-id="select-init-group"
              >
                <option value="">Select a group...</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              testId="btn-cancel-user"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newUser.username}
              testId="btn-save-user"
            >
              Create User
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete User"
        testId="delete-user-modal"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirmOpen(false)}
              testId="btn-cancel-delete-user"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              testId="btn-confirm-delete-user"
              variant="danger"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <Alert
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertTitle}
        message={alertMsg}
        type="error"
        testId="alert-users"
      />
    </div>
  );
};
