import React, { useState, useEffect } from "react";
import { User, Product, PermissionCode } from "../types";
import { checkPermission } from "../services/mockDb";
import { productsApi } from "../services/apiService";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Alert } from "../components/Alert";
import { getInventoryInsights } from "../services/geminiService";

interface StockViewProps {
  currentUser: User;
}

export const StockView: React.FC<StockViewProps> = ({ currentUser }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: 0,
    price: 0,
  });

  const showAlert = (title: string, msg: string) => {
    setAlertTitle(title);
    setAlertMsg(msg);
    setAlertOpen(true);
  };

  const canManage = checkPermission(currentUser, PermissionCode.MANAGE_STOCK);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await productsApi.getAll();
    setProducts(data);
    setIsLoading(false);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku,
        quantity: product.quantity,
        price: product.price,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: "", sku: "", quantity: 0, price: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    // Validação: price e quantity não podem ser negativos
    if (formData.price < 0 || formData.quantity < 0) {
      showAlert(
        "Validação",
        "Price and quantity must be greater than or equal to 0",
      );
      return;
    }

    if (!formData.name.trim() || !formData.sku.trim()) {
      showAlert("Validação", "Name and SKU are required");
      return;
    }

    setIsLoading(true);
    let success = false;

    if (editingProduct) {
      success =
        (await productsApi.update(editingProduct.id, {
          ...editingProduct,
          ...formData,
          lastUpdated: new Date().toISOString(),
        })) !== null;
    } else {
      success =
        (await productsApi.create({
          ...formData,
          lastUpdated: new Date().toISOString(),
        })) !== null;
    }

    if (success) {
      await loadProducts();
      setIsModalOpen(false);
    } else {
      showAlert("Erro", "Erro ao salvar produto");
    }
    setIsLoading(false);
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      setIsLoading(true);
      const success = await productsApi.delete(productToDelete);
      if (success) {
        await loadProducts();
        setDeleteConfirmOpen(false);
        setProductToDelete(null);
      } else {
        showAlert("Erro", "Erro ao deletar produto");
      }
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await getInventoryInsights(products);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            data-test-id="page-title-inventory"
          >
            Inventory
          </h1>
          <p className="text-gray-500" data-test-id="page-subtitle-inventory">
            Manage your product stock levels.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={handleAnalyze}
            loading={isAnalyzing}
            disabled={products.length === 0}
            testId="btn-analyze-stock"
          >
            {isAnalyzing ? "Analyzing..." : " ✨ AI Insight"}
          </Button>
          {canManage && (
            <Button onClick={() => handleOpenModal()} testId="btn-add-product">
              Add Product
            </Button>
          )}
        </div>
      </div>

      {aiAnalysis && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg animate-fade-in-down">
          <h3 className="font-semibold text-indigo-900 mb-2 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
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
            Smart Insights
          </h3>
          <div
            className="text-indigo-800 text-sm prose prose-indigo"
            dangerouslySetInnerHTML={{ __html: aiAnalysis }}
          />
          <button
            onClick={() => setAiAnalysis(null)}
            className="mt-2 text-xs text-indigo-500 underline hover:text-indigo-700"
            data-test-id="btn-dismiss-ai-analysis"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table
          className="min-w-full divide-y divide-gray-200"
          data-test-id="stock-table"
        >
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              {canManage && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50"
                data-test-id={`row-${product.id}`}
              >
                <td
                  className="px-6 py-4 whitespace-nowrap font-medium text-gray-900"
                  data-test-id={`product-name`}
                >
                  {product.name}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-gray-500"
                  data-test-id={`product-sku`}
                >
                  {product.sku}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-right text-gray-900"
                  data-test-id={`product-price`}
                >
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.quantity < 10
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {product.quantity}
                  </span>
                </td>
                {canManage && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="text-indigo-600 hover:text-indigo-900"
                      data-test-id={`edit-product-button`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                      data-test-id={`delete-product-button`}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No products found.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add Product"}
        testId="product-modal"
      >
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              data-test-id="label-product-name"
            >
              Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              data-test-id="input-product-name"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              data-test-id="label-product-sku"
            >
              SKU
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              data-test-id="input-product-sku"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                data-test-id="label-product-price"
              >
                Price
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                data-test-id="input-product-price"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                data-test-id="label-product-qty"
              >
                Quantity
              </label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: Math.max(0, parseInt(e.target.value) || 0),
                  })
                }
                data-test-id="input-product-qty"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              testId="btn-cancel-product"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} testId="btn-save-product">
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Product"
        testId="delete-confirm-modal"
      >
        <div className="space-y-4" data-test-id="delete-modal-description">
          <p className="text-gray-700">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirmOpen(false)}
              testId="btn-cancel-delete"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              testId="btn-confirm-delete"
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
        testId="alert-stock"
      />
    </div>
  );
};
