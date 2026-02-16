import { Permission, PermissionCode } from './types';

export const ALL_PERMISSIONS: Permission[] = [
  { id: 'p1', code: PermissionCode.VIEW_STOCK, description: 'View Stock Items' },
  { id: 'p2', code: PermissionCode.MANAGE_STOCK, description: 'Create/Edit/Delete Stock' },
  { id: 'p3', code: PermissionCode.VIEW_USERS, description: 'View System Users' },
  { id: 'p4', code: PermissionCode.MANAGE_USERS, description: 'Add/Remove Users' },
  { id: 'p5', code: PermissionCode.VIEW_GROUPS, description: 'View User Groups' },
  { id: 'p6', code: PermissionCode.MANAGE_GROUPS, description: 'Manage Groups & Permissions' },
  { id: 'p7', code: PermissionCode.VIEW_BACKEND_CODE, description: 'View Generated Backend Code' },
];

export const MOCK_DELAY = 400;