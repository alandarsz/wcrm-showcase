import { requiredRule } from '../helper/rules';

export const reportKartuStockRules = {
  WAREHOUSE_ID: [],
  ITEM_ID: [requiredRule()],
  START_DATE: [requiredRule()],
};

export const reportServiceRecapRules = {
  WAREHOUSE_ID: [requiredRule()],
  START_DATE: [requiredRule()],
};

export const reportStockRecapRules = {
  START_DATE: [requiredRule()],
};

export const reportPurchasePayableRecapRules = {
  // SUPPLIER_CODE: [requiredRule()],
};

export const reportPurchasePaidRecapRules = {
  // SUPPLIER_CODE: [requiredRule()],
  START_DATE: [requiredRule()],
};

export const reportSaleReceivableRecapRules = {
  CUSTOMER_CODE: [requiredRule()],
};

export const reportBukuBesarRules = {
  ACCOUNT_ID: [],
  START_DATE: [requiredRule()],
  END_DATE: [requiredRule()],
};

export default {
  reportKartuStockRules,
  reportPurchasePayableRecapRules,
  reportPurchasePaidRecapRules,
  reportSaleReceivableRecapRules,
};
