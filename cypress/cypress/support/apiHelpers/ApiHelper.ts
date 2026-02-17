export default class ApiHelper {
  intercepts = {
    get: {
      products: () => cy.intercept("/api/products").as("getProducts"),
      users: () => cy.intercept("/api/users").as("getUsers"),
      groups: () => cy.intercept("/api/groups").as("getGroups"),
    },
    pages: {
      dashboard: () => {
        this.intercepts.get.products();
        this.intercepts.get.users();
        this.intercepts.get.groups();
      },
    },
  };

  wait = {
    dashboardLoad: () => cy.wait(["@getProducts", "@getUsers", "@getGroups"]),
  };
}
