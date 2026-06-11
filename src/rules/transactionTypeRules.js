import { requiredRule } from '../helper/rules';
import { maxStringRule } from '../helper/rules';

export const addTransactionType = {
  TRANSACTION_TYPE_NAME: [requiredRule(), maxStringRule(50)],
  TRANSACTION_TYPE_ACCOUNT_ID: [requiredRule()],
};

export default {
  addTransactionType,
};
