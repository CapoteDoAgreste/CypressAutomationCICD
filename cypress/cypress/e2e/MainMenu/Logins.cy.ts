import Logins from "../../support/pageFlows/Logins";

const flows = new Logins();

describe("Logins", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("should allow admin to login", () => {
    flows.loginAsAdmin();
  });
});
