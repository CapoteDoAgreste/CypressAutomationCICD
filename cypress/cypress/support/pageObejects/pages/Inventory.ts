import Navbar from "../Navbar";

export default class Inventory extends Navbar {
  title = () => cy.get("[data-test-id='page-title-inventory']");

  addProduct = () => cy.get("[data-test-id='add-product-button']");

  openEditByName = (productName: string) =>
    this.getRowByName(productName)
      .find("[data-test-id='edit-product-button']")
      .click();
  openDeleteByName = (productName: string) =>
    this.getRowByName(productName)
      .find("[data-test-id='delete-product-button']")
      .click();

  getSkuByName = (productName: string) =>
    this.getRowByName(productName)
      .find("[data-test-id='product-sku']")
      .invoke("text");

  getQuantityByName = (productName: string) =>
    this.getRowByName(productName)
      .find("[data-test-id='product-quantity']")
      .invoke("text");

  getPriceByName = (productName: string) =>
    this.getRowByName(productName)
      .find("[data-test-id='product-price']")
      .invoke("text");

  getNameBySku = (productSku: string) =>
    this.getRowBySku(productSku)
      .find("[data-test-id='product-name']")
      .invoke("text");

  openEditBySku = (productSku: string) =>
    this.getRowBySku(productSku)
      .find("[data-test-id='edit-product-button']")
      .click();

  getRowBySku = (sku: string) => cy.get("td").contains(sku).parent("tr");
  getRowByName = (name: string) => cy.get("td").contains(name).parent("tr");
}
