import { requiredRule, maxStringRule, minNumberRule } from '../helper/rules';

export const addExpensePaymentRules = {
  EXPENSE_TRANSACTION_TYPE_ID: [requiredRule()],
  PAYMENT_DATE: [requiredRule()],
  PAYMENT_BANK_ID: [requiredRule()],
  PAYMENT_AMOUNT: [requiredRule(), minNumberRule(1)],
  PAYMENT_REMARK: [requiredRule(), maxStringRule(150)],
};

export default {
  addExpensePaymentRules,
};
