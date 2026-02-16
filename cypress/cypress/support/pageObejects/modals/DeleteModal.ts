import { BaseModal } from "./BaseModal";

export default class DeleteModal extends BaseModal {
  description = () => cy.get("[data-test-id='delete-modal-description']");
  confirmButton = () => cy.get("[data-test-id='delete-confirm-button']");
  cancelButton = () => cy.get("[data-test-id='delete-cancel-button']");
}
