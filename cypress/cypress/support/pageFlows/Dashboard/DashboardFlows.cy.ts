import Dashboard from "cypress/support/pageObejects/pages/Dashboard";
import Logins from "../MainMenu/Logins";

export default class DashboardFlows extends Logins {
  page = new Dashboard();
  enterInDashboardThroughLogin() {
    this.loginAsAdmin();

    this.dashboard.title().should("have.text", "Dashboard");
  }
}
