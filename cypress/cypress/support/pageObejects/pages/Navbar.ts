export default class Navbar {
  dashboardLink = () => cy.get("[data-test-id='nav-dashboard']");
  inventoryLink = () => cy.get("[data-test-id='nav-stock']");
  usersLink = () => cy.get("[data-test-id='nav-users']");
  groupsLink = () => cy.get("[data-test-id='nav-groups']");
}
