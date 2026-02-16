export enum PermissionCode {
  VIEW_STOCK = 'VIEW_STOCK',
  MANAGE_STOCK = 'MANAGE_STOCK',
  VIEW_USERS = 'VIEW_USERS',
  MANAGE_USERS = 'MANAGE_USERS',
  VIEW_GROUPS = 'VIEW_GROUPS',
  MANAGE_GROUPS = 'MANAGE_GROUPS',
  VIEW_BACKEND_CODE = 'VIEW_BACKEND_CODE'
}

export interface Permission {
  id: string;
  code: PermissionCode;
  description: string;
}

export interface UserGroup {
  id: string;
  name: string;
  permissionIds: string[];
}

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  groupId?: string; 
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  lastUpdated: string;
}

export type ViewState = 'DASHBOARD' | 'STOCK' | 'USERS' | 'GROUPS' | 'BACKEND_EXPORT';