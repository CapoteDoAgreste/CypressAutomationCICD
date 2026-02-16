import React, { useState, useEffect } from "react";
import { User, UserGroup, PermissionCode } from "../types";
import { checkPermission } from "../services/mockDb";
import { groupsApi } from "../services/apiService";
import { ALL_PERMISSIONS } from "../constants";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";

interface GroupsViewProps {
  currentUser: User;
}

export const GroupsView: React.FC<GroupsViewProps> = ({ currentUser }) => {
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManage = checkPermission(currentUser, PermissionCode.MANAGE_GROUPS);

  // Carregar grupos do backend
  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loaded = await groupsApi.getAll();
      // Normalizar: garantir que permissionIds sempre seja um array
      const normalized = loaded.map((group) => ({
        ...group,
        permissionIds: group.permissionIds || [],
      }));
      setGroups(normalized);
      if (normalized.length > 0 && !selectedGroup) {
        setSelectedGroup(normalized[0]);
      }
    } catch (err) {
      setError("Erro ao carregar grupos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName) return;

    setIsLoading(true);
    setError(null);
    try {
      const newGroup = await groupsApi.create({
        name: newGroupName,
        permissionIds: [],
      });

      if (newGroup) {
        // Normalizar resposta do backend
        const normalized = {
          ...newGroup,
          permissionIds: newGroup.permissionIds || [],
        };
        const updated = [...groups, normalized];
        setGroups(updated);
        setSelectedGroup(normalized);
        setNewGroupName("");
        setIsModalOpen(false);
      }
    } catch (err) {
      setError("Erro ao criar grupo");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermission = async (permId: string) => {
    if (!selectedGroup || !canManage) return;

    const permList = selectedGroup.permissionIds || [];
    const hasPerm = permList.includes(permId);
    let newPerms;
    if (hasPerm) {
      newPerms = permList.filter((id) => id !== permId);
    } else {
      newPerms = [...permList, permId];
    }

    setIsLoading(true);
    setError(null);
    try {
      const updatedGroup = await groupsApi.update(selectedGroup.id, {
        ...selectedGroup,
        permissionIds: newPerms,
      });

      if (updatedGroup) {
        // Normalizar resposta do backend
        const normalized = {
          ...updatedGroup,
          permissionIds: updatedGroup.permissionIds || [],
        };
        const updatedGroups = groups.map((g) =>
          g.id === selectedGroup.id ? normalized : g,
        );
        setGroups(updatedGroups);
        setSelectedGroup(normalized);
      }
    } catch (err) {
      setError("Erro ao atualizar permissões");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl font-bold text-gray-900"
          data-test-id="page-title-groups"
        >
          RBAC Configuration
        </h1>
        {canManage && (
          <Button
            onClick={() => setIsModalOpen(true)}
            testId="btn-create-group"
            disabled={isLoading}
          >
            New Group
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-1 space-x-6 overflow-hidden">
        {/* Group List */}
        <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-700">User Groups</h3>
          </div>
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Carregando...</div>
          ) : (
            <ul>
              {groups.map((group) => (
                <li key={group.id}>
                  <button
                    onClick={() => setSelectedGroup(group)}
                    className={`w-full text-left px-4 py-3 border-l-4 transition-colors ${selectedGroup?.id === group.id ? "border-indigo-500 bg-indigo-50" : "border-transparent hover:bg-gray-50"}`}
                    data-test-id={`group-item-${group.name}`}
                  >
                    <div className="font-medium text-gray-900">
                      {group.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(group.permissionIds || []).length} permissions
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Permissions Matrix */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">
              Permissions for{" "}
              <span className="text-indigo-600">{selectedGroup?.name}</span>
            </h3>
            {!canManage && (
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                Read Only
              </span>
            )}
          </div>

          <div className="p-6 overflow-y-auto">
            {selectedGroup ? (
              <div className="grid gap-4">
                {ALL_PERMISSIONS.map((perm) => {
                  const isChecked = (
                    selectedGroup.permissionIds || []
                  ).includes(perm.id);
                  return (
                    <div
                      key={perm.id}
                      className={`flex items-start space-x-3 p-3 rounded border ${isChecked ? "border-indigo-200 bg-indigo-50" : "border-gray-200"}`}
                    >
                      <div className="flex h-5 items-center">
                        <input
                          id={`perm-${perm.id}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                          checked={isChecked}
                          onChange={() => togglePermission(perm.id)}
                          disabled={!canManage || isLoading}
                          data-test-id={`check-perm-${perm.code}`}
                        />
                      </div>
                      <div className="text-sm">
                        <label
                          htmlFor={`perm-${perm.id}`}
                          className="font-medium text-gray-900"
                        >
                          {perm.code}
                        </label>
                        <p className="text-gray-500">{perm.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-10">
                Select a group to configure permissions
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Group"
        testId="modal-group"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Group Name
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-1"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              data-test-id="input-group-name"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              testId="btn-cancel-group"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={!newGroupName || isLoading}
              testId="btn-save-group"
            >
              {isLoading ? "Criando..." : "Create"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
