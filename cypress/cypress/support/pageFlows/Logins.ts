import ApiHelper from "../apiHelpers/ApiHelper";
import Dashboard from "../pageObejects/pages/Dashboard";
import MainMenu from "../pageObejects/pages/MainMenu";

export default class Logins {
  mainMenu = new MainMenu();
  dashboard = new Dashboard();
  api = new ApiHelper();

  //It will be converted into dispatch table soon.
  users = {
    admin: {
      loginButton: this.mainMenu.admin,
      username: "admin",
      role: "Admin",
    },
    manager: {
      loginButton: this.mainMenu.manager,
      username: "manager_bob",
      role: "User",
    },
    auditor: {
      loginButton: this.mainMenu.auditor,
      username: "auditor_alice",
      role: "User",
    },
    guest: {
      loginButton: this.mainMenu.guest,
      username: "guest_no_access",
      role: "User",
    },
  };

  loginAsAdmin() {
    this.loginAndCheckUser(
      this.users.admin.loginButton(),
      this.users.admin.username,
      this.users.admin.role,
    );
  }

  loginAsManager() {
    this.loginAndCheckUser(
      this.users.manager.loginButton(),
      this.users.manager.username,
      this.users.manager.role,
    );
  }

  loginAsAuditor() {
    this.loginAndCheckUser(
      this.users.auditor.loginButton(),
      this.users.auditor.username,
      this.users.auditor.role,
    );
  }

  loginAsGuest() {
    this.loginAndCheckUser(
      this.users.guest.loginButton(),
      this.users.guest.username,
      this.users.guest.role,
    );
  }

  logout() {
    this.dashboard.logoutButton().click();
    this.mainMenu.title().should("contain", "StockGuard Login");

    this.mainMenu.admin().should("be.visible");
    this.mainMenu.manager().should("be.visible");
    this.mainMenu.auditor().should("be.visible");
    this.mainMenu.guest().should("be.visible");
  }

  private loginAndCheckUser(
    user: Cypress.Chainable<JQuery<HTMLElement>>,
    username: string,
    role: string,
  ) {
    this.login(user);
    this.dashboard.username().should("contain", username);
    this.dashboard.userRole().should("contain", role);
  }

  private login(user: Cypress.Chainable<JQuery<HTMLElement>>) {
    this.api.intercepts.pages.dashboard();
    user.click();
    this.api.wait.dashboardLoad();
    this.dashboard.title().should("contain", "Dashboard");
  }
}
