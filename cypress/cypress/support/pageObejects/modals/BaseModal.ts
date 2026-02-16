export class BaseModal {
  title = () => cy.get("[data-test-id='modal-title']");
  closeButton = () => cy.get("[data-test-id='modal-close-button']");
}
