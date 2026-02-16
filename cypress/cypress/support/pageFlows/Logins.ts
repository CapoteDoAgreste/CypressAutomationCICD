import MainMenu from "../pageObejects/pages/MainMenu";

export default class Logins {
  page = new MainMenu();
  loginAsAdmin() {
    this.page.admin().click();
  }
}
