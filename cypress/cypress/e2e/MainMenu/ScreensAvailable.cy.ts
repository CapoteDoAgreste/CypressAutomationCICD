import ScreensAvailable from "cypress/support/pageFlows/MainMenu/ScreensAvailable";

describe("Main Menu - Screens Available for each user", () => {
  const flows = new ScreensAvailable();
  beforeEach(() => {
    cy.visit("/");
  });
  afterEach(() => {
    flows.logout();
  });
  it("Admin should have access to all screens", () => {
    flows.adminShouldHaveAccessToAllScreens();
  });
  it("Manager should have access to Dashboard, Inventory", () => {
    flows.managerShouldHaveAccessToDashboardInventory();
  });
  it("Auditor should have access to all screens", () => {
    flows.auditorShouldHaveAccessToAllScreens();
  });
  it("Guest should have only access to Dashboard", () => {
    flows.guestShouldHaveAccessToDashboardOnly();
  });
});
