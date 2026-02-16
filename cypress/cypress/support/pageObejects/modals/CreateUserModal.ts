import { BaseModal } from "./BaseModal";

export default class CreateUserModal extends BaseModal {
  usernameInput = () => cy.get("[data-test-id='create-user-username-input']");
  checkAdmin = () => cy.get("[data-test-id='create-user-admin-checkbox']");
  saveButton = () => cy.get("[data-test-id='create-user-save-button']");
  initialGroupSelect = () =>
    cy.get("[data-test-id='create-user-initial-group-select']");

  usernameLabel = () => cy.get("[data-test-id='create-user-username-label']");
  adminLabel = () => cy.get("[data-test-id='create-user-admin-label']");
  groupLabel = () => cy.get("[data-test-id='create-user-initial-group-label']");
}
