import { requiredRule, maxStringRule, minNumberRule } from '../helper/rules';

export const addPaymentRules = {
  // PAYMENT_SOURCE_ID: [requiredRule()],
  PAYMENT_DATE: [requiredRule()],
  PAYMENT_BANK_ID: [requiredRule()],
  PAYMENT_AMOUNT: [requiredRule(), minNumberRule(0)],
  // PAYMENT_ISPAID: [requiredRule()],
  PAYMENT_REMARK: [requiredRule()],
};

export const salePaymentGroupRules = {
  SALE_PAYMENT_GROUP_DATE: [requiredRule()],
  SALE_PAYMENT_GROUP_BANK_ID: [requiredRule()],
};

export default {
  addPaymentRules,
  salePaymentGroupRules,
};
