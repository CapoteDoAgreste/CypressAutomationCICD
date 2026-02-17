import Dashboard from "cypress/support/pageObejects/pages/Dashboard";
import Logins from "./Logins";

export default class ScreensAvailable extends Logins {
  page = new Dashboard();

  adminShouldHaveAccessToAllScreens() {
    this.loginAsAdmin();
    this.allScreensShouldBeVisible();
  }

  managerShouldHaveAccessToDashboardInventory() {
    this.loginAsManager();
    this.page.dashboardLink().should("be.visible");
    this.page.inventoryLink().should("be.visible");
    this.page.usersLink().should("not.exist");
    this.page.groupsLink().should("not.exist");
  }

  auditorShouldHaveAccessToAllScreens() {
    this.loginAsAuditor();
    this.allScreensShouldBeVisible();
  }

  guestShouldHaveAccessToDashboardOnly() {
    this.loginAsGuest();
    this.page.dashboardLink().should("be.visible");
    this.page.inventoryLink().should("not.exist");
    this.page.usersLink().should("not.exist");
    this.page.groupsLink().should("not.exist");
  }

  private allScreensShouldBeVisible() {
    this.page.dashboardLink().should("be.visible");
    this.page.inventoryLink().should("be.visible");
    this.page.usersLink().should("be.visible");
    this.page.groupsLink().should("be.visible");
  }
}
