import Navbar from "./Navbar";

export default class Dashboard extends Navbar {
  title = () => cy.get("[data-test-id='page-title-dashboard']");
  subtitle = () => cy.get("[data-test-id='page-subtitle-dashboard']");

  totalProductsIndicator = () =>
    cy.get("[data-test-id='indicator-total-products']");
  totalValueIndicator = () => cy.get("[data-test-id='indicator-total-value']");
  totalQuantityIndicator = () =>
    cy.get("[data-test-id='indicator-total-quantity']");
  lowStockIndicator = () => cy.get("[data-test-id='indicator-low-stock']");
  totalUsersIndicator = () => cy.get("[data-test-id='indicator-total-users']");
  totalGroupsIndicator = () =>
    cy.get("[data-test-id='indicator-total-groups']");

  totalProductsValue = () => cy.get("[data-test-id='value-total-products']");
  totalValueValue = () => cy.get("[data-test-id='value-total-value']");
  totalQuantityValue = () => cy.get("[data-test-id='value-total-quantity']");
  lowStockValue = () => cy.get("[data-test-id='value-low-stock']");
  totalUsersValue = () => cy.get("[data-test-id='value-total-users']");
  totalGroupsValue = () => cy.get("[data-test-id='value-total-groups']");

  totalProductsLabel = () => cy.get("[data-test-id='label-total-products']");
  totalValueLabel = () => cy.get("[data-test-id='label-total-value']");
  totalQuantityLabel = () => cy.get("[data-test-id='label-total-quantity']");
  lowStockLabel = () => cy.get("[data-test-id='label-low-stock']");
  totalUsersLabel = () => cy.get("[data-test-id='label-total-users']");
  totalGroupsLabel = () => cy.get("[data-test-id='label-total-groups']");

  lowStockAlertSection = () =>
    cy.get("[data-test-id='low-stock-alert-section']");
  lowStockAlertTitle = () => cy.get("[data-test-id='low-stock-alert-title']");
  lowStockItems = (productId: string) =>
    cy.get(`[data-test-id='low-stock-item-${productId}']`);
}
