import { BaseModal } from "./BaseModal";

export default class CreateGroupModal extends BaseModal {
  groupNameInput = () => cy.get("[data-test-id='input-new-group-name']");
  saveButton = () => cy.get("[data-test-id='btn-save-new-group']");
  cancelButton = () => cy.get("[data-test-id='btn-cancel-new-group']");
  groupNameLabel = () => cy.get("[data-test-id='label-new-group-name']");
}
