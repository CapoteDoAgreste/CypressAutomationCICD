import Logins from "../../support/pageFlows/MainMenu/Logins";

const flows = new Logins();

describe("Logins", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  afterEach(() => {
    flows.logout();
  });
  it("should allow admin to login", () => {
    flows.loginAsAdmin();
  });
  it("should allow manager to login", () => {
    flows.loginAsManager();
  });
  it("should allow auditor to login", () => {
    flows.loginAsAuditor();
  });
  it("should allow guest to login", () => {
    flows.loginAsGuest();
  });
});
