export default class Users {
  title = () => cy.get("[data-test-id='page-title-users']");
  addUserButton = () => cy.get("[data-test-id='add-user-button']");

  userList = () => cy.get("[data-test-id='user-list']");

  getUserByName = (name: string) =>
    this.userList()
      .contains("[data-test-id='user-name']", name)
      .parent()
      .parent()
      .parent();

  getUserRoleByName = (name: string) =>
    this.getUserByName(name).find("[data-test-id^='user-role']");
  getUserGroupByName = (name: string) =>
    this.getUserByName(name).find("[data-test-id='select-group']");
  removeUserByName = (name: string) =>
    this.getUserByName(name).find("[data-test-id='remove-user-button']");

  addUser = () => cy.get("[data-test-id='add-user-button']");
}
