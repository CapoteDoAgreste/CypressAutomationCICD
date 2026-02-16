import { User, UserGroup, Product } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Tipos para a API
export interface ApiProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  lastUpdated: string;
}

export interface ApiUser {
  id: string;
  username: string;
  isAdmin: boolean;
  groupId?: string;
}

export interface ApiGroup {
  id: string;
  name: string;
  permissionIds: string[];
}

// Serviço de Products
export const productsApi = {
  async getAll(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: ApiProduct[] = await response.json();
      return data.map((p) => ({
        ...p,
        lastUpdated: p.lastUpdated || new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  },

  async create(
    product: Omit<Product, "id" | "lastUpdated">,
  ): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `prod-${Date.now()}`,
          ...product,
          lastUpdated: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      return null;
    }
  },

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          lastUpdated: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
      });
      return response.ok;
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      return false;
    }
  },
};

// Serviço de Users
export const usersApi = {
  async getAll(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return [];
    }
  },

  async create(user: Omit<User, "id">): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `user-${Date.now()}`,
          ...user,
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: "DELETE",
      });
      return response.ok;
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return false;
    }
  },
};

// Serviço de Groups
export const groupsApi = {
  async getAll(): Promise<UserGroup[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/groups`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar grupos:", error);
      return [];
    }
  },

  async create(group: Omit<UserGroup, "id">): Promise<UserGroup | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `group-${Date.now()}`,
          ...group,
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      return null;
    }
  },

  async update(
    id: string,
    group: Partial<UserGroup>,
  ): Promise<UserGroup | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/groups/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar grupo:", error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/groups/${id}`, {
        method: "DELETE",
      });
      return response.ok;
    } catch (error) {
      console.error("Erro ao deletar grupo:", error);
      return false;
    }
  },
};

// Health Check
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
};
