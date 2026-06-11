import { requiredRule, maxStringRule, maxNumberRule } from '../helper/rules';

export const purchaseHeaderEdit = {
  PURCHASE_ID: [requiredRule()],
  WAREHOUSE_ID: [requiredRule()],
  PURCHASE_SUPPLIER_CODE: [requiredRule('Please input supplier')],
  PURCHASE_PAY_DUE: [requiredRule()],
  PURCHASE_REMARKS: [maxStringRule(300), requiredRule()],
  // PURCHASE_DISC_PERCENTAGE: [],
  PURCHASE_DISC_AMOUNT: [],
  PURCHASE_INFO_LEAD_TIME: [maxNumberRule(1000)],
  PURCHASE_INFO_ETA: [requiredRule()],
  PURCHASE_TAX_CODE: [requiredRule('Tax Required')],
};

export const purchaseHeaderInsert = {
  WAREHOUSE_ID: [requiredRule()],
  PURCHASE_SUPPLIER_CODE: [requiredRule('Please input supplier')],
  PURCHASE_PAY_DUE: [requiredRule()],
  PURCHASE_INFO_LEAD_TIME: [{ type: 'number', message: 'Lead Time must be a number' }, maxNumberRule(1000)],
  PURCHASE_INFO_ETA: [requiredRule()],
  PURCHASE_REMARKS: [maxStringRule(300), requiredRule()],
};

export default {
  purchaseHeaderEdit,
  purchaseHeaderInsert,
};
