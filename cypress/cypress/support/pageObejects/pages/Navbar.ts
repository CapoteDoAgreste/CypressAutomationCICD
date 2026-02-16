export default class Navbar {
  navbar = {
    dashboard: () => cy.get("[data-test-id='nav-dashboard']"),
    inventory: () => cy.get("[data-test-id='nav-stock']"),
    users: () => cy.get("[data-test-id='nav-users']"),
    groups: () => cy.get("[data-test-id='nav-groups']"),
  };
}
