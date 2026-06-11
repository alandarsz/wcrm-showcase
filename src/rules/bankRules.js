import { requiredRule } from '../helper/rules';
import { maxStringRule } from '../helper/rules';

export const addBankRules = {
  BANK_CODE: [requiredRule()],
  BANK_NAME: [requiredRule()],
  BANK_COA_ID: [requiredRule()],
};

export default {
  addBankRules,
};
