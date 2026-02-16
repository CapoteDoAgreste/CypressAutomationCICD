import { User, UserGroup, Product, PermissionCode } from '../types';
import { ALL_PERMISSIONS } from '../constants';

// Initial Data
const INITIAL_GROUPS: UserGroup[] = [
  { id: 'g1', name: 'Stock Managers', permissionIds: ['p1', 'p2'] },
  { id: 'g2', name: 'Auditors', permissionIds: ['p1', 'p3', 'p5'] },
];

const INITIAL_USERS: User[] = [
  { id: 'u1', username: 'admin', isAdmin: true },
  { id: 'u2', username: 'manager_bob', isAdmin: false, groupId: 'g1' },
  { id: 'u3', username: 'auditor_alice', isAdmin: false, groupId: 'g2' },
  { id: 'u4', username: 'guest_no_access', isAdmin: false, groupId: '' },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 'prod1', name: 'Gaming Laptop X1', sku: 'TECH-001', quantity: 15, price: 1200, lastUpdated: new Date().toISOString() },
  { id: 'prod2', name: 'Wireless Mouse', sku: 'TECH-002', quantity: 150, price: 25, lastUpdated: new Date().toISOString() },
  { id: 'prod3', name: 'Mechanical Keyboard', sku: 'TECH-003', quantity: 45, price: 85, lastUpdated: new Date().toISOString() },
];

// Helper to simulate DB persistence
const load = <T,>(key: string, defaults: T): T => {
  const stored = localStorage.getItem(`stockguard_${key}`);
  return stored ? JSON.parse(stored) : defaults;
};

const save = (key: string, data: any) => {
  localStorage.setItem(`stockguard_${key}`, JSON.stringify(data));
};

// Data Access Object (DAO) Simulation
export const db = {
  getUsers: () => load<User[]>('users', INITIAL_USERS),
  saveUsers: (users: User[]) => save('users', users),
  
  getGroups: () => load<UserGroup[]>('groups', INITIAL_GROUPS),
  saveGroups: (groups: UserGroup[]) => save('groups', groups),
  
  getProducts: () => load<Product[]>('products', INITIAL_PRODUCTS),
  saveProducts: (products: Product[]) => save('products', products),
};

// Logic Simulation (Middleware behavior)
export const checkPermission = (user: User, requiredPermission: PermissionCode): boolean => {
  if (user.isAdmin) return true;
  if (!user.groupId) return false;

  const groups = db.getGroups();
  const userGroup = groups.find(g => g.id === user.groupId);
  if (!userGroup) return false;

  const permission = ALL_PERMISSIONS.find(p => p.code === requiredPermission);
  if (!permission) return false;

  return userGroup.permissionIds.includes(permission.id);
};