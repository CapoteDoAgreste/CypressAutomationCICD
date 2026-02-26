import { DashboardIndicators } from "cypress/support/enums/DashboardEnums";
import DashboardFlows from "./DashboardFlows.cy";

export default class InitialScreenFlows extends DashboardFlows {
  totalProducts = 3;
  totalStockValue = 8250.0;
  totalQuantity = 45;
  lowStockItems = 1;
  totalUsers = 3;

  checkItem = {
    [DashboardIndicators.TOTAL_PRODUCTS]: () => this.page.totalProductsValue(),
    [DashboardIndicators.LOW_STOCK_ITEMS]: () =>  this.page.lowStockValue(),
    [DashboardIndicators.QUANTITY]: () => this.page.totalQuantityValue(),
  };

  verifyInitialData() {}

  private checkTotalProductValue(value: number) {
    this.page.totalProductsValue().should("have.text", value.toString());
  }
}
