export default class Groups {
  title = () => cy.get("[data-test-id='page-title-groups']");
  selectGroup = (groupName: string) =>
    cy.get(`[data-test-id='group-item-${groupName}']`);
  checkPermission = (permName: string) =>
    cy.get(`[data-test-id='permission-checkbox-${permName}']`);
}
