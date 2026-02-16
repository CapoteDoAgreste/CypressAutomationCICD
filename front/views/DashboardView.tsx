import React, { useState, useEffect } from "react";
import { User, Product } from "../types";
import { productsApi } from "../services/apiService";
import { usersApi, groupsApi } from "../services/apiService";
import { db } from "../services/mockDb";

interface DashboardViewProps {
  currentUser: User;
}

export const DashboardView: React.FC<DashboardViewProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [groupsCount, setGroupsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [productsData, usersData, groupsData] = await Promise.all([
        productsApi.getAll(),
        usersApi.getAll(),
        groupsApi.getAll(),
      ]);
      setProducts(productsData);
      setUsersCount(usersData.length);
      setGroupsCount(groupsData.length);
    } catch (error) {
      console.error(
        "Erro ao carregar dados do dashboard, usando mockDb:",
        error,
      );
      // Fallback para mockDb
      setProducts(db.getProducts());
      setUsersCount(db.getUsers().length);
      setGroupsCount(db.getGroups().length);
    }
    setIsLoading(false);
  };

  // Calcular métricas
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockProducts = products.filter((p) => p.quantity < 10).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-gray-900"
          data-test-id="page-title-dashboard"
        >
          Dashboard
        </h1>
        <p className="text-gray-500" data-test-id="page-subtitle-dashboard">
          Sistema overview and key metrics.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Indicadores de Estoque */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total de Produtos */}
            <div
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              data-test-id="indicator-total-products"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-gray-500 text-sm font-medium"
                    data-test-id="label-total-products"
                  >
                    Total Products
                  </p>
                  <p
                    className="text-3xl font-bold text-gray-900 mt-2"
                    data-test-id="value-total-products"
                  >
                    {totalProducts}
                  </p>
                </div>
                <div className="bg-blue-100 rounded-lg p-3">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8-4m-8 4v10l8-4m0 0l-8-4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Value */}
            <div
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              data-test-id="indicator-total-value"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-gray-500 text-sm font-medium"
                    data-test-id="label-total-value"
                  >
                    Total Stock Value
                  </p>
                  <p
                    className="text-3xl font-bold text-gray-900 mt-2"
                    data-test-id="value-total-value"
                  >
                    ${totalValue.toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-100 rounded-lg p-3">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Quantity */}
            <div
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              data-test-id="indicator-total-quantity"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-gray-500 text-sm font-medium"
                    data-test-id="label-total-quantity"
                  >
                    Total Quantity
                  </p>
                  <p
                    className="text-3xl font-bold text-gray-900 mt-2"
                    data-test-id="value-total-quantity"
                  >
                    {totalQuantity}
                  </p>
                </div>
                <div className="bg-purple-100 rounded-lg p-3">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Low Stock Alert */}
            <div
              className={`rounded-xl shadow-sm border p-6 ${
                lowStockProducts > 0
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-gray-200"
              }`}
              data-test-id="indicator-low-stock"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-gray-500 text-sm font-medium"
                    data-test-id="label-low-stock"
                  >
                    Low Stock Items
                  </p>
                  <p
                    className={`text-3xl font-bold mt-2 ${
                      lowStockProducts > 0 ? "text-red-600" : "text-gray-900"
                    }`}
                    data-test-id="value-low-stock"
                  >
                    {lowStockProducts}
                  </p>
                </div>
                <div
                  className={`rounded-lg p-3 ${lowStockProducts > 0 ? "bg-red-100" : "bg-yellow-100"}`}
                >
                  <svg
                    className={`w-6 h-6 ${
                      lowStockProducts > 0 ? "text-red-600" : "text-yellow-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4v2m0 4v2m0-12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Indicadores de Usuários e Grupos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Total Users */}
            <div
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              data-test-id="indicator-total-users"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-gray-500 text-sm font-medium"
                    data-test-id="label-total-users"
                  >
                    Total Users
                  </p>
                  <p
                    className="text-3xl font-bold text-gray-900 mt-2"
                    data-test-id="value-total-users"
                  >
                    {usersCount}
                  </p>
                </div>
                <div className="bg-indigo-100 rounded-lg p-3">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM9 20H4v-2a6 6 0 0112 0v2H9z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Groups */}
            <div
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              data-test-id="indicator-total-groups"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-gray-500 text-sm font-medium"
                    data-test-id="label-total-groups"
                  >
                    Total Groups
                  </p>
                  <p
                    className="text-3xl font-bold text-gray-900 mt-2"
                    data-test-id="value-total-groups"
                  >
                    {groupsCount}
                  </p>
                </div>
                <div className="bg-orange-100 rounded-lg p-3">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo de Produtos em Baixo Estoque */}
          {lowStockProducts > 0 && (
            <div
              className="bg-red-50 border border-red-200 rounded-xl p-6"
              data-test-id="low-stock-alert-section"
            >
              <h3
                className="text-lg font-semibold text-red-900 mb-4"
                data-test-id="low-stock-alert-title"
              >
                ⚠️ Low Stock Alert
              </h3>
              <div className="space-y-2">
                {products
                  .filter((p) => p.quantity < 10)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between text-sm"
                      data-test-id={`low-stock-item-${product.id}`}
                    >
                      <span className="text-red-800 font-medium">
                        {product.name}
                      </span>
                      <span className="text-red-600">
                        {product.quantity} units
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
