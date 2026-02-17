export default class MainMenu {
  title = () => cy.get("h2");
  admin = () => cy.get("[data-test-id='login-admin']");
  manager = () => cy.get("[data-test-id='login-manager_bob']");
  auditor = () => cy.get("[data-test-id='login-auditor_alice']");
  guest = () => cy.get('[data-test-id="login-guest_no_access"]');
}
