import { BaseModal } from "./BaseModal";

export default class ProductModal extends BaseModal {
  nameInput = () => cy.get("[data-test-id='product-name-input']");
  skuInput = () => cy.get("[data-test-id='product-sku-input']");
  priceInput = () => cy.get("[data-test-id='product-price-input']");
  quantityInput = () => cy.get("[data-test-id='product-quantity-input']");
  saveButton = () => cy.get("[data-test-id='product-save-button']");
  cancelButton = () => cy.get("[data-test-id='product-cancel-button']");

  nameLabel = () => cy.get("[data-test-id='product-name-label']");
  skuLabel = () => cy.get("[data-test-id='product-sku-label']");
  priceLabel = () => cy.get("[data-test-id='product-price-label']");
  quantityLabel = () => cy.get("[data-test-id='product-quantity-label']");
}
